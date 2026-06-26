package com.sanitary.ecommerce.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanitary.ecommerce.product.Product;
import com.sanitary.ecommerce.product.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class AIChatService {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    @Value("${ai.gemini.model}")
    private String model;

    @Value("${ai.gemini.endpoint}")
    private String endpoint;

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = """
            Bạn là Trợ lý ảo AI của AQUA LUX.
            QUY TẮC:
            - Luôn xưng là "tôi" hoặc "Trợ lý ảo" và gọi khách hàng là "bạn" hoặc "quý khách".
            - CHỈ tư vấn sản phẩm có trong danh sách được cung cấp
            - Không bịa đặt thông tin
            - Trả lời chuyên nghiệp, ngắn gọn, bằng tiếng Việt
            """;

    public AIChatService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ChatResponse chat(ChatRequest request) {
        try {
            // Build product context from database
            String productContext = buildProductContext(request.getMessage());

            // Build full prompt
            String fullPrompt = buildPrompt(request, productContext);

            // Call Gemini API
            String geminiResponse = callGeminiAPI(fullPrompt);

            return new ChatResponse(geminiResponse, extractSuggestedSlugs(productContext));
        } catch (Exception e) {
            System.err.println("AIChatService ERROR: " + e.getMessage());
            e.printStackTrace();
            return new ChatResponse(
                    "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ trực tiếp! 😊",
                    List.of());
        }
    }

    private String buildProductContext(String userMessage) {
        String lowerMsg = userMessage.toLowerCase();

        // Parse intent from message
        String keyword = extractKeyword(lowerMsg);
        String categoryName = extractCategory(lowerMsg);
        BigDecimal maxPrice = extractMaxPrice(lowerMsg);
        BigDecimal minPrice = extractMinPrice(lowerMsg);

        List<Product> products;
        if (keyword.isEmpty() && categoryName.isEmpty() && maxPrice == null) {
            products = productRepository.findFeaturedForAI(PageRequest.of(0, 2));
        } else {
            products = productRepository.findForAIContext(null, minPrice, maxPrice, keyword, categoryName,
                    PageRequest.of(0, 2));
        }

        if (products.isEmpty()) {
            return "Không có sản phẩm phù hợp trong hệ thống hiện tại.";
        }

        StringBuilder sb = new StringBuilder("[SẢN PHẨM HIỆN CÓ]\n");
        for (Product p : products) {
            BigDecimal price = p.getSalePrice() != null ? p.getSalePrice() : p.getBasePrice();
            String priceStr = price != null ? String.format("%,.0f đồng", price) : "Liên hệ";
            sb.append(String.format("- %s | Giá: %s | Slug: %s\n",
                    p.getName(), priceStr, p.getSlug()));
        }
        return sb.toString();
    }

    private String extractKeyword(String msg) {
        // Remove common stopwords and extract meaningful terms
        String cleaned = msg
                .replace("tư vấn", "").replace("gợi ý", "").replace("bán", "")
                .replace("có", "").replace("không", "").replace("nào", "")
                .replace("cho", "").replace("tôi", "").replace("muốn", "")
                .replace("mua", "").replace("tìm", "").replace("cần", "").trim();
        return cleaned.length() > 2 ? cleaned : "";
    }

    private String extractCategory(String msg) {
        if (msg.contains("bồn cầu") || msg.contains("toilet") || msg.contains("wc"))
            return "bồn cầu";
        if (msg.contains("lavabo") || msg.contains("chậu rửa") || msg.contains("chậu lavabo"))
            return "lavabo";
        if (msg.contains("bồn tắm") || msg.contains("bathtub"))
            return "bồn tắm";
        if (msg.contains("vòi") || msg.contains("vòi nước") || msg.contains("faucet"))
            return "vòi";
        if (msg.contains("sen") || msg.contains("shower") || msg.contains("vòi sen"))
            return "sen tắm";
        if (msg.contains("gương") || msg.contains("tủ") || msg.contains("phụ kiện"))
            return "phụ kiện";
        return "";
    }

    private BigDecimal extractMaxPrice(String msg) {
        if (msg.contains("dưới 5 triệu") || msg.contains("dưới 5tr"))
            return BigDecimal.valueOf(5_000_000);
        if (msg.contains("dưới 10 triệu") || msg.contains("dưới 10tr"))
            return BigDecimal.valueOf(10_000_000);
        if (msg.contains("dưới 15 triệu") || msg.contains("dưới 15tr"))
            return BigDecimal.valueOf(15_000_000);
        if (msg.contains("dưới 20 triệu") || msg.contains("dưới 20tr"))
            return BigDecimal.valueOf(20_000_000);
        if (msg.contains("dưới 50 triệu") || msg.contains("dưới 50tr"))
            return BigDecimal.valueOf(50_000_000);
        if (msg.contains("dưới 100 triệu") || msg.contains("dưới 100tr"))
            return BigDecimal.valueOf(100_000_000);
        return null;
    }

    private BigDecimal extractMinPrice(String msg) {
        if (msg.contains("trên 50 triệu") || msg.contains("cao cấp") || msg.contains("luxury"))
            return BigDecimal.valueOf(50_000_000);
        if (msg.contains("trên 20 triệu"))
            return BigDecimal.valueOf(20_000_000);
        if (msg.contains("trên 10 triệu"))
            return BigDecimal.valueOf(10_000_000);
        return null;
    }

    private String buildPrompt(ChatRequest request, String productContext) {
        StringBuilder sb = new StringBuilder();
        sb.append(SYSTEM_PROMPT).append("\n\n");
        sb.append(productContext).append("\n\n");

        // Add conversation history
        if (request.getHistory() != null && !request.getHistory().isEmpty()) {
            sb.append("[LỊCH SỬ HỘI THOẠI]\n");
            for (ChatMessage msg : request.getHistory()) {
                sb.append(msg.getRole().equals("user") ? "Khách: " : "AI: ");
                sb.append(msg.getContent()).append("\n");
            }
            sb.append("\n");
        }

        sb.append("[CÂU HỎI MỚI]\nKhách: ").append(request.getMessage()).append("\nAI:");
        return sb.toString();
    }

    private String callGeminiAPI(String prompt) throws Exception {
        String url = endpoint + "/" + model + ":generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.8,
                        "maxOutputTokens", 1024,
                        "topP", 0.9));

        String jsonBody = objectMapper.writeValueAsString(requestBody);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        return root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText("Xin lỗi, tôi không thể xử lý yêu cầu này.");
    }

    private List<String> extractSuggestedSlugs(String productContext) {
        // Simple extraction of slugs for frontend product cards
        return List.of();
    }
}
