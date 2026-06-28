package com.sanitary.ecommerce.user;
import com.sanitary.ecommerce.user.entity.User;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_addresses")
@Getter
@Setter
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "recipient_name", nullable = false)
    private String recipientName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String province;

    @Column
    private String district;

    @Column
    private String ward;

    @Column(name = "street_detail", nullable = false)
    private String streetDetail;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
}
