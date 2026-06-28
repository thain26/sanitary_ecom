package com.sanitary.ecommerce.promotion.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "user_vouchers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "voucher_id"})
})
public class UserVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "voucher_id", nullable = false)
    private Long voucherId;

    @Column(name = "used_at")
    private ZonedDateTime usedAt;

    @Column(name = "order_id")
    private Long orderId;

    public UserVoucher() {}

    public UserVoucher(Long userId, Long voucherId, ZonedDateTime usedAt, Long orderId) {
        this.userId = userId;
        this.voucherId = voucherId;
        this.usedAt = usedAt;
        this.orderId = orderId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getVoucherId() { return voucherId; }
    public void setVoucherId(Long voucherId) { this.voucherId = voucherId; }

    public ZonedDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(ZonedDateTime usedAt) { this.usedAt = usedAt; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}
