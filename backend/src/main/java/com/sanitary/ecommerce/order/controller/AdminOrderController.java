package com.sanitary.ecommerce.order.controller;

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
public class AdminOrderController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

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
}
