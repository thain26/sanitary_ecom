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
public class AdminCollectionController {

    private final ProductRepository productRepository;
    private final CollectionRepository collectionRepository;

@GetMapping("/collections")
    @Transactional(readOnly = true)
    public ResponseEntity<List<com.sanitary.ecommerce.product.entity.Collection>> getAdminCollections() {
        List<com.sanitary.ecommerce.product.entity.Collection> all = collectionRepository.findAllWithProducts();
        return ResponseEntity.ok(all);
    }

    @GetMapping("/collections/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<com.sanitary.ecommerce.product.entity.Collection> getCollectionById(@PathVariable Long id) {
        return collectionRepository.findByIdWithProducts(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/collections/{id}/toggle-banner")
    public ResponseEntity<com.sanitary.ecommerce.product.entity.Collection> toggleCollectionBanner(@PathVariable Long id) {
        return collectionRepository.findById(id).map(c -> {
            c.setShowOnHeroBanner(!c.getShowOnHeroBanner());
            return ResponseEntity.ok(collectionRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/collections/{id}")
    public ResponseEntity<com.sanitary.ecommerce.product.entity.Collection> updateCollection(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return collectionRepository.findById(id).map(c -> {
            if (body.containsKey("name")) c.setName((String) body.get("name"));
            if (body.containsKey("description")) c.setDescription((String) body.get("description"));
            if (body.containsKey("bannerUrl")) c.setBannerUrl((String) body.get("bannerUrl"));
            if (body.containsKey("showOnHeroBanner")) c.setShowOnHeroBanner((Boolean) body.get("showOnHeroBanner"));
            return ResponseEntity.ok(collectionRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/collections")
    public ResponseEntity<com.sanitary.ecommerce.product.entity.Collection> createCollection(@RequestBody Map<String, Object> body) {
        com.sanitary.ecommerce.product.entity.Collection c = new com.sanitary.ecommerce.product.entity.Collection();
        c.setName((String) body.get("name"));
        c.setDescription((String) body.getOrDefault("description", ""));
        c.setBannerUrl((String) body.getOrDefault("bannerUrl", null));
        c.setIsActive(true);
        c.setShowOnHeroBanner(false);
        // Generate slug from name
        c.setSlug(slugify((String) body.get("name")) + "-" + System.currentTimeMillis() % 10000);
        return ResponseEntity.ok(collectionRepository.save(c));
    }

    @DeleteMapping("/collections/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        return collectionRepository.findById(id).map(c -> {
            c.setIsActive(false);
            collectionRepository.save(c);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/collections/{id}/products/{productId}")
    public ResponseEntity<com.sanitary.ecommerce.product.entity.Collection> addProductToCollection(
            @PathVariable Long id, @PathVariable Long productId) {
        return collectionRepository.findById(id).map(c -> {
            productRepository.findById(productId).ifPresent(p -> {
                if (!c.getProducts().contains(p)) {
                    c.getProducts().add(p);
                }
            });
            return ResponseEntity.ok(collectionRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/collections/{id}/products/{productId}")
    public ResponseEntity<com.sanitary.ecommerce.product.entity.Collection> removeProductFromCollection(
            @PathVariable Long id, @PathVariable Long productId) {
        return collectionRepository.findById(id).map(c -> {
            c.getProducts().removeIf(p -> p.getId().equals(productId));
            return ResponseEntity.ok(collectionRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Helper method to slugify strings (Vietnamese accent friendly)
    private String slugify(String input) {
        if (input == null) return "";
        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        slug = slug.toLowerCase()
                .replaceAll("[đĐ]", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
        return slug;
    }
}
