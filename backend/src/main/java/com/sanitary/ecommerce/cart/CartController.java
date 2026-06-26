package com.sanitary.ecommerce.cart;

import com.sanitary.ecommerce.product.Product;
import com.sanitary.ecommerce.product.ProductRepository;
import com.sanitary.ecommerce.promotion.FlashSaleProduct;
import com.sanitary.ecommerce.promotion.FlashSaleProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final FlashSaleProductRepository flashSaleProductRepository;

    @GetMapping("/{sessionId}")
    @Transactional
    public ResponseEntity<?> getCart(@PathVariable String sessionId) {
        validateSessionId(sessionId);
        Optional<Cart> cartOpt = cartRepository.findBySessionId(sessionId);
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            ZonedDateTime now = ZonedDateTime.now();
            boolean updated = false;
            
            for (CartItem item : cart.getItems()) {
                Product product = item.getProduct();
                BigDecimal currentPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getBasePrice();
                
                List<FlashSaleProduct> activeFlashSaleProducts = flashSaleProductRepository.findActiveFlashSaleProducts(product.getId(), now);
                if (!activeFlashSaleProducts.isEmpty()) {
                    currentPrice = activeFlashSaleProducts.get(0).getSalePrice();
                }
                
                if (item.getPrice() == null || item.getPrice().compareTo(currentPrice) != 0) {
                    item.setPrice(currentPrice);
                    updated = true;
                }
            }
            
            if (updated) {
                cartRepository.save(cart);
            }
            
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.ok(new Cart());
    }

    @PostMapping("/{sessionId}/add")
    @Transactional
    public ResponseEntity<?> addToCart(@PathVariable String sessionId, @RequestBody Map<String, Object> payload) {
        validateSessionId(sessionId);
        Long productId = Long.valueOf(payload.get("productId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());

        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Determine current price (including active Flash Sale if any)
        BigDecimal unitPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getBasePrice();
        ZonedDateTime now = ZonedDateTime.now();
        List<FlashSaleProduct> activeFlashSaleProducts = flashSaleProductRepository.findActiveFlashSaleProducts(product.getId(), now);
        if (!activeFlashSaleProducts.isEmpty()) {
            unitPrice = activeFlashSaleProducts.get(0).getSalePrice();
        }

        Cart cart = cartRepository.findBySessionId(sessionId).orElse(new Cart());
        if (cart.getSessionId() == null) {
            cart.setSessionId(sessionId);
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
            existingItem.get().setPrice(unitPrice);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setPrice(unitPrice);
            cart.addItem(newItem);
        }

        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/{sessionId}/update")
    @Transactional
    public ResponseEntity<?> updateCartItem(@PathVariable String sessionId, @RequestBody Map<String, Object> payload) {
        validateSessionId(sessionId);
        Long productId = Long.valueOf(payload.get("productId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());

        Cart cart = cartRepository.findBySessionId(sessionId).orElseThrow(() -> new RuntimeException("Cart not found"));
        
        cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst()
            .ifPresent(item -> {
                if (quantity <= 0) {
                    cart.removeItem(item);
                } else {
                    item.setQuantity(quantity);
                    
                    // Update price as well to current active price
                    Product product = item.getProduct();
                    BigDecimal unitPrice = product.getSalePrice() != null ? product.getSalePrice() : product.getBasePrice();
                    ZonedDateTime now = ZonedDateTime.now();
                    List<FlashSaleProduct> activeFlashSaleProducts = flashSaleProductRepository.findActiveFlashSaleProducts(product.getId(), now);
                    if (!activeFlashSaleProducts.isEmpty()) {
                        unitPrice = activeFlashSaleProducts.get(0).getSalePrice();
                    }
                    item.setPrice(unitPrice);
                }
            });

        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{sessionId}/remove/{productId}")
    @Transactional
    public ResponseEntity<?> removeFromCart(@PathVariable String sessionId, @PathVariable Long productId) {
        validateSessionId(sessionId);
        Cart cart = cartRepository.findBySessionId(sessionId).orElseThrow(() -> new RuntimeException("Cart not found"));
        
        cart.getItems().stream()
            .filter(item -> item.getProduct().getId().equals(productId))
            .findFirst()
            .ifPresent(cart::removeItem);

        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    private void validateSessionId(String sessionId) {
        if (sessionId == null || !sessionId.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
            throw new IllegalArgumentException("Invalid session ID format");
        }
    }
}
