package com.sanitary.ecommerce.order.controller;
import com.sanitary.ecommerce.order.entity.Order;
import com.sanitary.ecommerce.order.entity.OrderItem;
import com.sanitary.ecommerce.order.repository.OrderRepository;
import com.sanitary.ecommerce.promotion.entity.FlashSaleProduct;
import com.sanitary.ecommerce.promotion.repository.FlashSaleProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import com.sanitary.ecommerce.user.entity.User;
import com.sanitary.ecommerce.user.repository.UserRepository;
import com.sanitary.ecommerce.promotion.entity.Voucher;
import com.sanitary.ecommerce.promotion.repository.VoucherRepository;
import com.sanitary.ecommerce.promotion.entity.UserVoucher;
import com.sanitary.ecommerce.promotion.repository.UserVoucherRepository;
import java.security.Principal;
import java.util.List;
import com.sanitary.ecommerce.cart.entity.Cart;
import com.sanitary.ecommerce.cart.entity.CartItem;
import com.sanitary.ecommerce.cart.repository.CartRepository;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;
    private final UserVoucherRepository userVoucherRepository;
    private final com.sanitary.ecommerce.promotion.repository.FlashSaleProductRepository flashSaleProductRepository;

    @PostMapping("/checkout/{sessionId}")
    @Transactional
    public ResponseEntity<?> checkout(@PathVariable String sessionId, @RequestBody Order request) {
        validateSessionId(sessionId);
        Cart cart = cartRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Cart not found or empty"));

        if (cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        Order order = new Order();
        order.setOrderCode("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        order.setPaymentMethod("COD");
        order.setStatus("PENDING");
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            String email = auth.getName();
            userRepository.findByEmail(email).ifPresent(u -> order.setUserId(u.getId()));
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        java.time.ZonedDateTime now = java.time.ZonedDateTime.now();

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setModelCode(cartItem.getProduct().getModelCode());
            
            BigDecimal price;
            
            // Check for active Flash Sale
            java.util.List<com.sanitary.ecommerce.promotion.entity.FlashSaleProduct> activeFlashSaleProducts = flashSaleProductRepository.findActiveFlashSaleProducts(cartItem.getProduct().getId(), now);
            
            if (!activeFlashSaleProducts.isEmpty()) {
                com.sanitary.ecommerce.promotion.entity.FlashSaleProduct fsp = activeFlashSaleProducts.get(0);
                
                int availableLimit = fsp.getQuantityLimit() != null ? (fsp.getQuantityLimit() - fsp.getSoldCount()) : Integer.MAX_VALUE;
                if (availableLimit < cartItem.getQuantity()) {
                    throw new RuntimeException("Sản phẩm " + cartItem.getProduct().getName() + " trong chương trình Flash Sale không đủ số lượng. Hiện còn: " + Math.max(0, availableLimit));
                }
                
                price = fsp.getSalePrice();
                
                // Deduct from Flash Sale limit
                fsp.setSoldCount(fsp.getSoldCount() + cartItem.getQuantity());
                flashSaleProductRepository.save(fsp);
            } else {
                price = cartItem.getProduct().getSalePrice() != null ? 
                        cartItem.getProduct().getSalePrice() : cartItem.getProduct().getBasePrice();
            }
            
            orderItem.setUnitPrice(price);
            orderItem.setTotalPrice(price.multiply(new BigDecimal(cartItem.getQuantity())));
            
            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }

        order.setSubtotal(subtotal);
        
        // Handle Voucher
        BigDecimal discountAmount = BigDecimal.ZERO;
        Voucher appliedVoucher = null;
        if (request.getVoucherCode() != null && !request.getVoucherCode().trim().isEmpty()) {
            String code = request.getVoucherCode().toUpperCase();
            java.util.Optional<Voucher> vOpt = voucherRepository.findByCode(code);
            if (vOpt.isPresent()) {
                Voucher v = vOpt.get();
                // Kiểm tra user đã dùng voucher này chưa
                boolean alreadyUsed = false;
                if (order.getUserId() != null) {
                    alreadyUsed = userVoucherRepository.existsByUserIdAndVoucherId(order.getUserId(), v.getId());
                }
                
                if (!alreadyUsed && v.isActive() && !now.isBefore(v.getStartDate()) && !now.isAfter(v.getEndDate()) && 
                    (v.getUsageLimit() == null || v.getUsedCount() < v.getUsageLimit()) &&
                    subtotal.compareTo(v.getMinOrderValue()) >= 0) {
                    
                    if ("PERCENT".equalsIgnoreCase(v.getType())) {
                        discountAmount = subtotal.multiply(v.getValue()).divide(new BigDecimal("100"));
                        if (v.getMaxDiscount() != null && discountAmount.compareTo(v.getMaxDiscount()) > 0) {
                            discountAmount = v.getMaxDiscount();
                        }
                    } else {
                        discountAmount = v.getValue();
                        if (discountAmount.compareTo(subtotal) > 0) {
                            discountAmount = subtotal;
                        }
                    }
                    
                    // Increment used count
                    v.setUsedCount(v.getUsedCount() + 1);
                    voucherRepository.save(v);
                    
                    order.setVoucherCode(code);
                    appliedVoucher = v;
                }
            }
        }
        
        order.setDiscountAmount(discountAmount);
        BigDecimal total = subtotal.add(order.getShippingFee()).subtract(discountAmount);
        if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;
        order.setTotalAmount(total);

        orderRepository.save(order);
        
        // Ghi lịch sử sử dụng voucher vào bảng user_vouchers
        if (appliedVoucher != null && order.getUserId() != null) {
            UserVoucher uv = new UserVoucher(
                order.getUserId(),
                appliedVoucher.getId(),
                java.time.ZonedDateTime.now(),
                order.getId()
            );
            userVoucherRepository.save(uv);
        }
        
        // Clear cart after successful checkout
        cartRepository.delete(cart);

        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @PutMapping("/{id}/cancel")
    @Transactional
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
                
        if (!order.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order in status: " + order.getStatus());
        }
        
        order.setStatus("CANCELLED");
        return ResponseEntity.ok(orderRepository.save(order));
    }

    private void validateSessionId(String sessionId) {
        if (sessionId == null || !sessionId.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
            throw new IllegalArgumentException("Invalid session ID format");
        }
    }
}
