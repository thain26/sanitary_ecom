package com.sanitary.ecommerce.order;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.sanitary.ecommerce.product.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;

    private String modelCode;
    private String productName;
    
    @Column(name = "is_reviewed")
    private boolean isReviewed = false;

    // Optional: map old UI fields if needed
    public BigDecimal getUnitPrice() { return price; }
    public void setUnitPrice(BigDecimal p) { this.price = p; }
    public BigDecimal getTotalPrice() { return subtotal; }
    public void setTotalPrice(BigDecimal s) { this.subtotal = s; }

    @Transient
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }
}
