package com.sanitary.ecommerce.order.service;
import com.sanitary.ecommerce.order.entity.Order;
import com.sanitary.ecommerce.order.entity.OrderItem;
import com.sanitary.ecommerce.order.entity.OrderStatusHistory;
import com.sanitary.ecommerce.order.repository.OrderRepository;

import com.sanitary.ecommerce.order.dto.CheckoutRequest;
import com.sanitary.ecommerce.product.entity.Product;
import com.sanitary.ecommerce.product.repository.ProductRepository;
import com.sanitary.ecommerce.promotion.entity.FlashSaleProduct;
import com.sanitary.ecommerce.promotion.repository.FlashSaleProductRepository;
import com.sanitary.ecommerce.user.entity.User;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final FlashSaleProductRepository flashSaleProductRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
            FlashSaleProductRepository flashSaleProductRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.flashSaleProductRepository = flashSaleProductRepository;
    }

    @Transactional
    public Order createOrder(CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng không được để trống.");
        }

        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setStatus("PENDING");
        
        String pm = request.getPaymentMethod();
        if (pm == null || pm.trim().isEmpty()) {
            pm = "COD";
        }
        order.setPaymentMethod(pm);
        order.setPaymentStatus("UNPAID");
        order.setNote(request.getNote());

        // Default values
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO); // Free shipping

        // If user is authenticated, link order to user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            Object principal = auth.getPrincipal();
            if (principal instanceof User) {
                order.setUserId(((User) principal).getId());
            }
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        // Process items
        for (CheckoutRequest.Item reqItem : request.getItems()) {
            Product product = productRepository.findById(reqItem.getProductId())
                    .orElseThrow(
                            () -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + reqItem.getProductId()));

            if (product.getStock() < reqItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho. Hiện còn: "
                        + product.getStock());
            }

            // Deduct stock and increment sold count atomically
            int updated = productRepository.decrementStock(product.getId(), reqItem.getQuantity());
            if (updated == 0) {
                throw new RuntimeException("Sản phẩm " + product.getName() + " đã hết hàng hoặc không đủ số lượng giao dịch.");
            }
            
            // Update the product object with new values in case it's used later in the same transaction
            product.setStock(product.getStock() - reqItem.getQuantity());
            product.setSoldCount(product.getSoldCount() + reqItem.getQuantity());

            // Check for active Flash Sale
            ZonedDateTime now = ZonedDateTime.now();
            List<FlashSaleProduct> activeFlashSaleProducts = flashSaleProductRepository
                    .findActiveFlashSaleProducts(product.getId(), now);

            BigDecimal unitPrice;
            if (!activeFlashSaleProducts.isEmpty()) {
                FlashSaleProduct fsp = activeFlashSaleProducts.get(0);
                // Check if Flash Sale has quantity left
                int availableLimit = fsp.getQuantityLimit() != null ? (fsp.getQuantityLimit() - fsp.getSoldCount())
                        : Integer.MAX_VALUE;
                if (availableLimit < reqItem.getQuantity()) {
                    throw new RuntimeException("Sản phẩm " + product.getName()
                            + " trong chương trình Flash Sale không đủ số lượng. Hiện còn: "
                            + Math.max(0, availableLimit));
                }

                // Apply Flash Sale price
                unitPrice = fsp.getSalePrice();

                // Deduct from Flash Sale limit
                fsp.setSoldCount(fsp.getSoldCount() + reqItem.getQuantity());
                flashSaleProductRepository.save(fsp);
            } else {
                unitPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getBasePrice();
            }

            BigDecimal itemSubtotal = unitPrice.multiply(BigDecimal.valueOf(reqItem.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setModelCode(product.getModelCode());
            orderItem.setProductName(product.getName());
            orderItem.setPrice(unitPrice);
            orderItem.setQuantity(reqItem.getQuantity());
            orderItem.setSubtotal(itemSubtotal);

            order.addItem(orderItem);
        }

        order.setSubtotal(subtotal);
        order.setTotal(subtotal); // total = subtotal - discount + shipping = subtotal - 0 + 0

        // Process Address directly into Order entity
        order.setCustomerName(request.getRecipientName());
        order.setCustomerPhone(request.getPhone());
        String fullAddress = String.format("%s, %s, %s, %s",
                request.getStreetDetail(), request.getWard(), request.getDistrict(), request.getProvince());
        order.setShippingAddress(fullAddress);

        // Process initial status history
        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus("PENDING");
        history.setPaymentStatus("UNPAID");
        history.setNote(String.format("Đơn hàng đã được khởi tạo thành công (Thanh toán %s).", pm));
        order.addStatusHistory(history);

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Order trackOrder(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã: " + orderCode));
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        if (order.getUserId() == null || !order.getUserId().equals(userId)) {
            throw new RuntimeException("Đơn hàng không thuộc về tài khoản của bạn");
        }

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng đang ở trạng thái CHỜ XỬ LÝ (PENDING)");
        }

        order.setStatus("CANCELLED");

        // Restore product stock and decrease sold count
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                product.setSoldCount(Math.max(0, product.getSoldCount() - item.getQuantity()));
                productRepository.save(product);
            }
        }

        // Add history log
        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus("CANCELLED");
        history.setPaymentStatus(order.getPaymentStatus());
        history.setNote("Đơn hàng đã được hủy bởi khách hàng.");
        order.addStatusHistory(history);

        return orderRepository.save(order);
    }

    private String generateOrderCode() {
        String dateStr = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now());
        Random random = new Random();
        String code;
        do {
            int randomNum = random.nextInt(100000);
            code = String.format("ORD-%s-%05d", dateStr, randomNum);
        } while (orderRepository.findByOrderCode(code).isPresent());
        return code;
    }
}
