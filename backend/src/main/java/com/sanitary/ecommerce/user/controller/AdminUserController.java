package com.sanitary.ecommerce.user.controller;

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
public class AdminUserController {

    private final UserRepository userRepository;

@GetMapping("/users")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        if (keyword != null && !keyword.trim().isEmpty()) {
            return ResponseEntity.ok(userRepository.findByEmailContainingIgnoreCaseOrFullNameContainingIgnoreCase(keyword, keyword, pageable));
        }
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setStatus(status.toUpperCase());
        return ResponseEntity.ok(userRepository.save(user));
    }
}
