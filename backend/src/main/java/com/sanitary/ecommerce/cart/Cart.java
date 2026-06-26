package com.sanitary.ecommerce.cart;

import com.sanitary.ecommerce.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@Setter
public class Cart extends BaseEntity {

    @Column(name = "session_id")
    private String sessionId; // DĂ¹ng cho guest checkout

    // @ManyToOne User user; -> Táº¡m thá»i lÆ°á»£c bá» hoáº·c Ä‘á»ƒ null cho guest

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    public void addItem(CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item) {
        items.remove(item);
        item.setCart(null);
    }
}
