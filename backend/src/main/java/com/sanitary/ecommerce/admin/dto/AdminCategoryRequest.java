package com.sanitary.ecommerce.admin.dto;

import lombok.Data;

@Data
public class AdminCategoryRequest {
    private String name;
    private Long parentId;
    private String imageUrl;
    private String description;
    private boolean active;
    private String slug;
}
