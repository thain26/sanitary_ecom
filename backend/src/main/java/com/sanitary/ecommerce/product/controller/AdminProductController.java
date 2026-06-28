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
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AdminProductService adminProductService;

@GetMapping("/products")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        
        if (categoryId != null) {
            List<Long> categoryIds = new ArrayList<>();
            categoryIds.add(categoryId);
            
            List<Category> allCategories = categoryRepository.findAll();
            Queue<Long> queue = new LinkedList<>();
            queue.add(categoryId);
            
            while (!queue.isEmpty()) {
                Long currentId = queue.poll();
                List<Long> childrenIds = allCategories.stream()
                        .filter(c -> currentId.equals(c.getParentId()))
                        .map(Category::getId)
                        .collect(Collectors.toList());
                for (Long childId : childrenIds) {
                    if (!categoryIds.contains(childId)) {
                        categoryIds.add(childId);
                        queue.add(childId);
                    }
                }
            }
            return ResponseEntity.ok(productRepository.searchAdminProductsWithCategory(keyword, categoryIds, brandId, active, pageable));
        } else {
            return ResponseEntity.ok(productRepository.searchAdminProductsWithoutCategory(keyword, brandId, active, pageable));
        }
    }

    @PostMapping("/products")
    @CacheEvict(value = {"categories", "homeData"}, allEntries = true)
    public ResponseEntity<Product> createProduct(@RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(adminProductService.createProduct(request));
    }

    @PutMapping("/products/{id}")
    @CacheEvict(value = {"categories", "homeData"}, allEntries = true)
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(adminProductService.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    @CacheEvict(value = {"categories", "homeData"}, allEntries = true)
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
        return ResponseEntity.noContent().build();
    }
}
