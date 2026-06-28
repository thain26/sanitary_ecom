package com.sanitary.ecommerce.review.controller;
import com.sanitary.ecommerce.review.ReviewRequestDto;
import com.sanitary.ecommerce.review.entity.Review;
import com.sanitary.ecommerce.review.repository.ReviewRepository;

import com.sanitary.ecommerce.order.entity.OrderItem;
import com.sanitary.ecommerce.order.repository.OrderItemRepository;
import com.sanitary.ecommerce.product.entity.Product;
import com.sanitary.ecommerce.product.repository.ProductRepository;
import com.sanitary.ecommerce.user.entity.User;
import com.sanitary.ecommerce.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    @GetMapping("/api/public/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdAndIsActiveTrueOrderByCreatedAtDesc(productId));
    }

    @PostMapping("/api/reviews")
    @Transactional
    public ResponseEntity<Review> createReview(Principal principal, @Valid @RequestBody ReviewRequestDto dto) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        if (dto.getOrderItemId() == null) {
            throw new RuntimeException("Cần cung cấp mã mục đơn hàng để đánh giá");
        }

        OrderItem orderItem = orderItemRepository.findById(dto.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Mục đơn hàng không tồn tại"));

        // Verify order item ownership and status
        if (orderItem.getOrder().getUserId() == null || !orderItem.getOrder().getUserId().equals(user.getId())) {
            throw new RuntimeException("Mục đơn hàng không thuộc về bạn");
        }

        if (!orderItem.getProduct().getId().equals(product.getId())) {
            throw new RuntimeException("Sản phẩm đánh giá không khớp với mục đơn hàng");
        }

        if (!"DELIVERED".equalsIgnoreCase(orderItem.getOrder().getStatus())) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã được giao thành công");
        }

        if (orderItem.isReviewed()) {
            throw new RuntimeException("Mục đơn hàng này đã được đánh giá");
        }

        // Save Review
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setOrderItemId(orderItem.getId());
        review.setRating(dto.getRating());
        review.setContent(dto.getContent());
        review.setImagesJson(dto.getImages() != null ? dto.getImages() : List.of());
        review.setIsVerified(true);

        review = reviewRepository.save(review);

        // Mark item as reviewed
        orderItem.setReviewed(true);
        orderItemRepository.save(orderItem);

        // Recalculate average rating for the product
        List<Review> productReviews = reviewRepository.findByProductIdAndIsActiveTrueOrderByCreatedAtDesc(product.getId());
        int count = productReviews.size();
        double sum = productReviews.stream().mapToDouble(Review::getRating).sum();
        product.setRatingCount(count);
        product.setRatingAvg(BigDecimal.valueOf(sum / count).setScale(2, RoundingMode.HALF_UP));
        productRepository.save(product);

        return ResponseEntity.ok(review);
    }
}
