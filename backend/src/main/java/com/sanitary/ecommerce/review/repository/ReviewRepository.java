package com.sanitary.ecommerce.review.repository;
import com.sanitary.ecommerce.review.entity.Review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndIsActiveTrueOrderByCreatedAtDesc(Long productId);
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByProductModelCodeContainingIgnoreCaseOrderByCreatedAtDesc(String modelCode);
    boolean existsByUserIdAndOrderItemId(Long userId, Long orderItemId);
}
