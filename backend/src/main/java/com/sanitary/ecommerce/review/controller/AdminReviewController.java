package com.sanitary.ecommerce.review.controller;

import com.sanitary.ecommerce.admin.dto.AdminBrandRequest;
import com.sanitary.ecommerce.admin.dto.AdminCategoryRequest;
import com.sanitary.ecommerce.admin.dto.AdminDashboardStatsDto;
import com.sanitary.ecommerce.admin.dto.AdminProductRequest;
import com.sanitary.ecommerce.order.entity.Order;
import com.sanitary.ecommerce.order.entity.OrderItem;
import com.sanitary.ecommerce.order.entity.OrderStatusHistory;
import com.sanitary.ecommerce.order.repository.OrderItemRepository;
import com.sanitary.ecommerce.order.repository.OrderRepository;
import com.sanitary.ecommerce.product.entity.Brand;
import com.sanitary.ecommerce.product.entity.Category;
import com.sanitary.ecommerce.product.entity.Collection;
import com.sanitary.ecommerce.product.entity.Product;
import com.sanitary.ecommerce.product.repository.BrandRepository;
import com.sanitary.ecommerce.product.repository.CategoryRepository;
import com.sanitary.ecommerce.product.repository.CollectionRepository;
import com.sanitary.ecommerce.product.repository.ProductRepository;
import com.sanitary.ecommerce.product.service.AdminBrandService;
import com.sanitary.ecommerce.product.service.AdminCategoryService;
import com.sanitary.ecommerce.product.service.AdminProductService;
import com.sanitary.ecommerce.promotion.entity.Voucher;
import com.sanitary.ecommerce.promotion.repository.VoucherRepository;
import com.sanitary.ecommerce.review.entity.Review;
import com.sanitary.ecommerce.review.repository.ReviewRepository;
import com.sanitary.ecommerce.user.entity.User;
import com.sanitary.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Transactional
public class AdminReviewController {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

@GetMapping("/reviews")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Review>> getAllReviews(@RequestParam(required = false) String modelCode) {
        if (modelCode != null && !modelCode.isBlank()) {
            return ResponseEntity.ok(reviewRepository.findByProductModelCodeContainingIgnoreCaseOrderByCreatedAtDesc(modelCode.trim()));
        }
        return ResponseEntity.ok(reviewRepository.findAllByOrderByCreatedAtDesc());
    }

    @PatchMapping("/reviews/{id}/status")
    public ResponseEntity<Void> toggleReviewStatus(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Đánh giá không tồn tại"));
        Product product = review.getProduct();
        
        review.setIsActive(!review.getIsActive());
        reviewRepository.save(review);
        
        // Recalculate average rating for the product based only on active reviews
        List<Review> productReviews = reviewRepository.findByProductIdAndIsActiveTrueOrderByCreatedAtDesc(product.getId());
        int count = productReviews.size();
        double sum = productReviews.stream().mapToDouble(Review::getRating).sum();
        product.setRatingCount(count);
        product.setRatingAvg(count > 0 ? BigDecimal.valueOf(sum / count).setScale(2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO);
        productRepository.save(product);
        
        return ResponseEntity.ok().build();
    }
}
