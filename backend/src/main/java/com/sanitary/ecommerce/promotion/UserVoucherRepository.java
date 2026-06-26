package com.sanitary.ecommerce.promotion;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {
    boolean existsByUserIdAndVoucherId(Long userId, Long voucherId);
}
