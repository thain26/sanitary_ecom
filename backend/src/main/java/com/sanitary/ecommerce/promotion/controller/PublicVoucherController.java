package com.sanitary.ecommerce.promotion.controller;
import com.sanitary.ecommerce.promotion.VoucherValidationResponse;
import com.sanitary.ecommerce.promotion.entity.Voucher;
import com.sanitary.ecommerce.promotion.repository.UserVoucherRepository;
import com.sanitary.ecommerce.promotion.repository.VoucherRepository;

import com.sanitary.ecommerce.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/public/vouchers")
public class PublicVoucherController {

    private final VoucherRepository voucherRepository;
    private final UserVoucherRepository userVoucherRepository;

    public PublicVoucherController(VoucherRepository voucherRepository, UserVoucherRepository userVoucherRepository) {
        this.voucherRepository = voucherRepository;
        this.userVoucherRepository = userVoucherRepository;
    }

    @PostMapping("/validate")
    public ResponseEntity<VoucherValidationResponse> validateVoucher(
            @RequestParam String code,
            @RequestParam BigDecimal orderValue) {
        
        // Yêu cầu đăng nhập để dùng voucher
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
        
        if (!isAuthenticated) {
            return ResponseEntity.ok(new VoucherValidationResponse(false, "Vui lòng đăng nhập để sử dụng mã giảm giá.", BigDecimal.ZERO, code));
        }
        
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code.toUpperCase());
        
        if (voucherOpt.isEmpty()) {
            return ResponseEntity.ok(new VoucherValidationResponse(false, "Mã giảm giá không tồn tại.", BigDecimal.ZERO, code));
        }
        
        Voucher voucher = voucherOpt.get();
        
        if (!voucher.isActive()) {
            return ResponseEntity.ok(new VoucherValidationResponse(false, "Mã giảm giá đã ngừng hoạt động.", BigDecimal.ZERO, code));
        }
        
        ZonedDateTime now = ZonedDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            return ResponseEntity.ok(new VoucherValidationResponse(false, "Mã giảm giá đã hết hạn hoặc chưa có hiệu lực.", BigDecimal.ZERO, code));
        }
        
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return ResponseEntity.ok(new VoucherValidationResponse(false, "Mã giảm giá đã hết lượt sử dụng.", BigDecimal.ZERO, code));
        }
        
        // Kiểm tra user đã dùng voucher này chưa
        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            Long userId = ((User) principal).getId();
            if (userVoucherRepository.existsByUserIdAndVoucherId(userId, voucher.getId())) {
                return ResponseEntity.ok(new VoucherValidationResponse(false, "Bạn đã sử dụng mã giảm giá này rồi.", BigDecimal.ZERO, code));
            }
        }
        
        if (orderValue.compareTo(voucher.getMinOrderValue()) < 0) {
            return ResponseEntity.ok(new VoucherValidationResponse(false, "Đơn hàng chưa đạt giá trị tối thiểu " + voucher.getMinOrderValue() + "đ để dùng mã này.", BigDecimal.ZERO, code));
        }
        
        // Tính toán số tiền được giảm
        BigDecimal discountAmount = BigDecimal.ZERO;
        if ("PERCENT".equalsIgnoreCase(voucher.getType())) {
            discountAmount = orderValue.multiply(voucher.getValue()).divide(new BigDecimal("100"));
            if (voucher.getMaxDiscount() != null && discountAmount.compareTo(voucher.getMaxDiscount()) > 0) {
                discountAmount = voucher.getMaxDiscount();
            }
        } else {
            // FIXED_AMOUNT
            discountAmount = voucher.getValue();
            if (discountAmount.compareTo(orderValue) > 0) {
                discountAmount = orderValue; // Không thể giảm lớn hơn giá trị đơn hàng
            }
        }
        
        return ResponseEntity.ok(new VoucherValidationResponse(true, "Áp dụng mã giảm giá thành công!", discountAmount, code));
    }
}
