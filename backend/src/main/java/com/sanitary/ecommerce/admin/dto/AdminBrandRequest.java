package com.sanitary.ecommerce.admin.dto;

import lombok.Data;

@Data
public class AdminBrandRequest {
    private String name;
    private String logoUrl;
    private String description;
    private boolean active;
    private String slug;
}
