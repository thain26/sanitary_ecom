package com.sanitary.ecommerce.admin.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminProductRequest {
    private String name;
    private String modelCode;
    private String sku;
    private String description;
    private String detail;
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private int stock;
    private boolean isFeatured;
    private boolean isActive;
    
    private Long categoryId;
    private Long brandId;
    
    private List<ImageDto> images;
    
    @Data
    public static class ImageDto {
        private String url;
        private boolean isPrimary;
    }
}
