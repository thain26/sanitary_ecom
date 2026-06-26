package com.sanitary.ecommerce.user;

import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class WishlistId implements Serializable {
    private Long userId;
    private Long productId;

    public WishlistId(Long userId, Long productId) {
        this.userId = userId;
        this.productId = productId;
    }
}
