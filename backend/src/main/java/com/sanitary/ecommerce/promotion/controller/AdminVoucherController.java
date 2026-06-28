package com.sanitary.ecommerce.promotion.controller;

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
public class AdminVoucherController {

    private final VoucherRepository voucherRepository;

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
}
