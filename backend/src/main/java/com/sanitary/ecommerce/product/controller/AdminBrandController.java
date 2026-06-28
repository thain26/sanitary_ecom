package com.sanitary.ecommerce.product.controller;

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
public class AdminBrandController {

    private final BrandRepository brandRepository;
    private final AdminBrandService adminBrandService;

@GetMapping("/brands")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Brand>> getBrands() {
        return ResponseEntity.ok(brandRepository.findAll());
    }

    @PostMapping("/brands")
    @CacheEvict(value = {"categories", "homeData", "brands"}, allEntries = true)
    public ResponseEntity<Brand> createBrand(@RequestBody AdminBrandRequest request) {
        return ResponseEntity.ok(adminBrandService.createBrand(request));
    }

    @PutMapping("/brands/{id}")
    @CacheEvict(value = {"categories", "homeData", "brands"}, allEntries = true)
    public ResponseEntity<Brand> updateBrand(@PathVariable Long id, @RequestBody AdminBrandRequest brandDetails) {
        return ResponseEntity.ok(adminBrandService.updateBrand(id, brandDetails));
    }

    @DeleteMapping("/brands/{id}")
    @CacheEvict(value = {"categories", "homeData", "brands"}, allEntries = true)
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
        brandRepository.delete(brand);
        return ResponseEntity.noContent().build();
    }
}
