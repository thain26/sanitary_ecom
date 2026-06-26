package com.sanitary.ecommerce.admin;

import com.sanitary.ecommerce.admin.dto.AdminBrandRequest;
import com.sanitary.ecommerce.admin.dto.AdminCategoryRequest;
import com.sanitary.ecommerce.admin.dto.AdminDashboardStatsDto;
import com.sanitary.ecommerce.admin.dto.AdminProductRequest;
import com.sanitary.ecommerce.order.*;
import com.sanitary.ecommerce.product.*;
import com.sanitary.ecommerce.promotion.Voucher;
import com.sanitary.ecommerce.promotion.VoucherRepository;
import com.sanitary.ecommerce.review.Review;
import com.sanitary.ecommerce.review.ReviewRepository;
import com.sanitary.ecommerce.user.User;
import com.sanitary.ecommerce.user.UserRepository;
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
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final VoucherRepository voucherRepository;
    private final ExportService exportService;
    private final CollectionRepository collectionRepository;
    private final ReviewRepository reviewRepository;
    private final AdminProductService adminProductService;
    private final AdminCategoryService adminCategoryService;
    private final AdminBrandService adminBrandService;

    @GetMapping("/dashboard/stats")
    @Transactional(readOnly = true)
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();

        // 1. Total revenue (sum of total where status = 'DELIVERED')
        BigDecimal totalRevenue = orderRepository.sumDeliveredRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }
        stats.setTotalRevenue(totalRevenue);

        // 2. Counts
        stats.setTotalOrders(orderRepository.count());
        stats.setTotalCustomers(userRepository.countByRole("CUSTOMER"));
        stats.setTotalProducts(productRepository.count());

        // 3. Status counts
        List<Object[]> statusCountResults = orderRepository.countByStatus();
        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] row : statusCountResults) {
            if (row[0] != null) {
                statusCounts.put(((String) row[0]).toUpperCase(), ((Number) row[1]).longValue());
            }
        }
        stats.setOrderStatusCounts(statusCounts);

        // 4. Top selling products
        List<AdminDashboardStatsDto.ProductSummary> topProducts = productRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "soldCount"))
        ).getContent().stream()
                .map(p -> new AdminDashboardStatsDto.ProductSummary(
                        p.getId(), p.getName(), p.getModelCode(), p.getStock(), p.getSoldCount(), p.getBasePrice(), p.getSalePrice()
                ))
                .collect(Collectors.toList());
        stats.setTopProducts(topProducts);

        // 5. Low stock products (stock <= 10)
        List<AdminDashboardStatsDto.ProductSummary> lowStock = productRepository.findByStockLessThanEqualOrderByStockAsc(10).stream()
                .map(p -> new AdminDashboardStatsDto.ProductSummary(
                        p.getId(), p.getName(), p.getModelCode(), p.getStock(), p.getSoldCount(), p.getBasePrice(), p.getSalePrice()
                ))
                .collect(Collectors.toList());
        stats.setLowStockProducts(lowStock);

        // 6. Monthly revenue (from delivered orders, grouped by YYYY-MM)
        List<Object[]> monthlyResults = orderRepository.monthlyRevenue();
        List<AdminDashboardStatsDto.MonthlyRevenue> monthlyRevenueList = monthlyResults.stream()
                .map(row -> new AdminDashboardStatsDto.MonthlyRevenue((String) row[0], (BigDecimal) row[1]))
                .collect(Collectors.toList());
        stats.setMonthlyRevenue(monthlyRevenueList);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reports/revenue")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getRevenueReport() {
        BigDecimal totalRevenue = orderRepository.sumDeliveredRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        List<Object[]> monthlyResults = orderRepository.monthlyRevenue();
        Map<String, BigDecimal> monthlyGroup = new TreeMap<>();
        for (Object[] row : monthlyResults) {
            monthlyGroup.put((String) row[0], (BigDecimal) row[1]);
        }
        
        long orderCount = 0;
        List<Object[]> statusCounts = orderRepository.countByStatus();
        for (Object[] row : statusCounts) {
            if ("DELIVERED".equalsIgnoreCase((String) row[0])) {
                orderCount = ((Number) row[1]).longValue();
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("orderCount", orderCount);
        result.put("monthlyRevenue", monthlyGroup);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reports/revenue/export/excel")
    @Transactional(readOnly = true)
    public ResponseEntity<org.springframework.core.io.InputStreamResource> exportRevenueExcel() throws java.io.IOException {
        List<Order> deliveredOrders = orderRepository.findByStatusOrderByCreatedAtDesc("DELIVERED");
        java.io.ByteArrayInputStream in = exportService.exportRevenueExcel(deliveredOrders);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=revenue-report.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new org.springframework.core.io.InputStreamResource(in));
    }

    @GetMapping("/reports/revenue/export/pdf")
    @Transactional(readOnly = true)
    public ResponseEntity<org.springframework.core.io.InputStreamResource> exportRevenuePdf() {
        List<Order> deliveredOrders = orderRepository.findByStatusOrderByCreatedAtDesc("DELIVERED");
        java.io.ByteArrayInputStream in = exportService.exportRevenuePdf(deliveredOrders);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=revenue-report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(new org.springframework.core.io.InputStreamResource(in));
    }

    // ─────────────────────────────────────────────────────────────
    // PRODUCTS CRUD
    // ─────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────
    // CATEGORIES CRUD
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/categories")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "name")));
    }

    @PostMapping("/categories")
    @CacheEvict(value = {"categories", "homeData"}, allEntries = true)
    public ResponseEntity<Category> createCategory(@RequestBody AdminCategoryRequest request) {
        return ResponseEntity.ok(adminCategoryService.createCategory(request));
    }

    @PutMapping("/categories/{id}")
    @CacheEvict(value = {"categories", "homeData"}, allEntries = true)
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody AdminCategoryRequest categoryDetails) {
        return ResponseEntity.ok(adminCategoryService.updateCategory(id, categoryDetails));
    }

    @DeleteMapping("/categories/{id}")
    @CacheEvict(value = {"categories", "homeData"}, allEntries = true)
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        categoryRepository.delete(category);
        return ResponseEntity.noContent().build();
    }

    // --- REVIEWS ---
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

    // ─────────────────────────────────────────────────────────────
    // BRANDS CRUD
    // ─────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────
    // ORDERS MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<Order>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String orderCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        
        boolean hasStatus = status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status);
        boolean hasCode = orderCode != null && !orderCode.trim().isEmpty();

        if (hasStatus && hasCode) {
            return ResponseEntity.ok(orderRepository.findByStatusAndOrderCodeContainingIgnoreCase(status, orderCode, pageable));
        } else if (hasStatus) {
            return ResponseEntity.ok(orderRepository.findByStatus(status, pageable));
        } else if (hasCode) {
            return ResponseEntity.ok(orderRepository.findByOrderCodeContainingIgnoreCase(orderCode, pageable));
        }
        return ResponseEntity.ok(orderRepository.findAll(pageable));
    }

    @GetMapping("/orders/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        // Touch to lazy load items and history before returning
        order.getItems().size();
        order.getStatusHistory().size();
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String note
    ) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        String oldStatus = order.getStatus();
        String newStatus = status.toUpperCase();
        order.setStatus(newStatus);

        // If transitioning to CANCELLED, restore product stock
        if ("CANCELLED".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (product != null) {
                    product.setStock(product.getStock() + item.getQuantity());
                    product.setSoldCount(Math.max(0, product.getSoldCount() - item.getQuantity()));
                    productRepository.save(product);
                }
            }
        }

        // Add history log
        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus(newStatus);
        history.setPaymentStatus(order.getPaymentStatus());
        history.setNote(note != null ? note : "Trạng thái đơn hàng được cập nhật bởi Admin.");
        order.addStatusHistory(history);

        return ResponseEntity.ok(orderRepository.save(order));
    }

    @PatchMapping("/orders/{id}/payment")
    public ResponseEntity<Order> updateOrderPaymentStatus(
            @PathVariable Long id,
            @RequestParam String paymentStatus,
            @RequestParam(required = false) String note
    ) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        order.setPaymentStatus(paymentStatus.toUpperCase());
        
        // Add history log
        OrderStatusHistory history = new OrderStatusHistory();
        history.setStatus(order.getStatus());
        history.setPaymentStatus(order.getPaymentStatus());
        history.setNote(note != null ? note : "Trạng thái thanh toán cập nhật thành: " + paymentStatus);
        order.addStatusHistory(history);

        return ResponseEntity.ok(orderRepository.save(order));
    }

    // ─────────────────────────────────────────────────────────────
    // CUSTOMERS MANAGEMENT
    // ─────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────
    // VOUCHERS CRUD
    // ─────────────────────────────────────────────────────────────

    @GetMapping("/vouchers")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Voucher>> getVouchers() {
        return ResponseEntity.ok(voucherRepository.findAll(Sort.by(Sort.Direction.DESC, "id")));
    }

    @PostMapping("/vouchers")
    public ResponseEntity<Voucher> createVoucher(@RequestBody Voucher voucher) {
        voucher.setActive(true);
        if (voucher.getUsedCount() < 0) {
            voucher.setUsedCount(0);
        }
        return ResponseEntity.ok(voucherRepository.save(voucher));
    }

    @PutMapping("/vouchers/{id}")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucherDetails) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));

        voucher.setCode(voucherDetails.getCode());
        voucher.setName(voucherDetails.getName());
        voucher.setType(voucherDetails.getType());
        voucher.setValue(voucherDetails.getValue());
        voucher.setMinOrderValue(voucherDetails.getMinOrderValue());
        voucher.setMaxDiscount(voucherDetails.getMaxDiscount());
        voucher.setUsageLimit(voucherDetails.getUsageLimit());
        voucher.setAppliesTo(voucherDetails.getAppliesTo());
        voucher.setStartDate(voucherDetails.getStartDate());
        voucher.setEndDate(voucherDetails.getEndDate());
        voucher.setActive(voucherDetails.isActive());

        return ResponseEntity.ok(voucherRepository.save(voucher));
    }

    @DeleteMapping("/vouchers/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found with id: " + id));
        voucher.setActive(false);
        voucherRepository.save(voucher);
        return ResponseEntity.noContent().build();
    }

    // ─── Collection Management ──────────────────────────────────────────

    @GetMapping("/collections")
    @Transactional(readOnly = true)
    public ResponseEntity<List<com.sanitary.ecommerce.product.Collection>> getAdminCollections() {
        List<com.sanitary.ecommerce.product.Collection> all = collectionRepository.findAllWithProducts();
        return ResponseEntity.ok(all);
    }

    @GetMapping("/collections/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<com.sanitary.ecommerce.product.Collection> getCollectionById(@PathVariable Long id) {
        return collectionRepository.findByIdWithProducts(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/collections/{id}/toggle-banner")
    public ResponseEntity<com.sanitary.ecommerce.product.Collection> toggleCollectionBanner(@PathVariable Long id) {
        return collectionRepository.findById(id).map(c -> {
            c.setShowOnHeroBanner(!c.getShowOnHeroBanner());
            return ResponseEntity.ok(collectionRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/collections/{id}")
    public ResponseEntity<com.sanitary.ecommerce.product.Collection> updateCollection(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return collectionRepository.findById(id).map(c -> {
            if (body.containsKey("name")) c.setName((String) body.get("name"));
            if (body.containsKey("description")) c.setDescription((String) body.get("description"));
            if (body.containsKey("bannerUrl")) c.setBannerUrl((String) body.get("bannerUrl"));
            if (body.containsKey("showOnHeroBanner")) c.setShowOnHeroBanner((Boolean) body.get("showOnHeroBanner"));
            return ResponseEntity.ok(collectionRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/collections")
    public ResponseEntity<com.sanitary.ecommerce.product.Collection> createCollection(@RequestBody Map<String, Object> body) {
        com.sanitary.ecommerce.product.Collection c = new com.sanitary.ecommerce.product.Collection();
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
    public ResponseEntity<com.sanitary.ecommerce.product.Collection> addProductToCollection(
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
    public ResponseEntity<com.sanitary.ecommerce.product.Collection> removeProductFromCollection(
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
