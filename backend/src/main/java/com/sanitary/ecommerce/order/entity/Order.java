package com.sanitary.ecommerce.order.entity;

import com.sanitary.ecommerce.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order extends BaseEntity {

    private String orderCode;

    // Guest Info
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private String note;

    private BigDecimal subtotal;
    private BigDecimal shippingFee = BigDecimal.ZERO;
    private BigDecimal total;

    private String status = "PENDING"; // PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
    private String paymentMethod = "COD";

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    // --- Added back for compatibility with existing services ---
    @Column(name = "user_id")
    private Long userId;
    
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private String voucherCode;
    private String paymentStatus = "UNPAID";

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    public void addStatusHistory(OrderStatusHistory history) {
        if(statusHistory == null) statusHistory = new ArrayList<>();
        statusHistory.add(history);
        history.setOrder(this);
    }

    // Optional: map old UI fields if needed
    public BigDecimal getTotalAmount() { return total; }
    public void setTotalAmount(BigDecimal t) { this.total = t; }
}
