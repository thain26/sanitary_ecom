package com.sanitary.ecommerce.admin;

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
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ExportService exportService;

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
}
