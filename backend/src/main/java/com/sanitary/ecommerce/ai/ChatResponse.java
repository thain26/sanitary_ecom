package com.sanitary.ecommerce.ai;

import java.math.BigDecimal;
import java.util.List;

public class ChatResponse {
    private String reply;
    private List<ProductSuggestion> suggestedProducts;

    public ChatResponse(String reply, List<ProductSuggestion> suggestedProducts) {
        this.reply = reply;
        this.suggestedProducts = suggestedProducts;
    }

    public String getReply() { return reply; }
    public List<ProductSuggestion> getSuggestedProducts() { return suggestedProducts; }

    public static class ProductSuggestion {
        private String name;
        private String slug;
        private BigDecimal price;
        private String imageUrl;

        public ProductSuggestion(String name, String slug, BigDecimal price, String imageUrl) {
            this.name = name;
            this.slug = slug;
            this.price = price;
            this.imageUrl = imageUrl;
        }

        public String getName() { return name; }
        public String getSlug() { return slug; }
        public BigDecimal getPrice() { return price; }
        public String getImageUrl() { return imageUrl; }
    }
}
