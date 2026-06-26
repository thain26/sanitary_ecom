package com.sanitary.ecommerce.product;


import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PublicApiService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;

    public PublicApiService(CategoryRepository categoryRepository, 
                            ProductRepository productRepository, 
                            BrandRepository brandRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
    }

    @Cacheable(value = "brands", key = "'active'")
    public List<Brand> getBrands() {
        return brandRepository.findByIsActiveTrue();
    }

    @Cacheable(value = "homeData")
    public Map<String, Object> getHomeData() {
        Map<String, Object> data = new HashMap<>();
        data.put("banners", java.util.Collections.emptyList());
        
        List<Category> rootCategories = categoryRepository.findByParentIdIsNullAndIsActiveTrueOrderByNameAsc();
        data.put("categories", rootCategories);
        
        List<Product> featuredProducts = productRepository.findByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc();
        data.put("featuredProducts", featuredProducts.stream().limit(8).collect(Collectors.toList()));
        
        return data;
    }

    @Cacheable(value = "categories", key = "'tree'")
    public List<Map<String, Object>> getCategoryTree() {
        List<Category> allCategories = categoryRepository.findByIsActiveTrueOrderByNameAsc();
        
        Map<Long, List<Category>> childrenMap = allCategories.stream()
                .filter(c -> c.getParentId() != null)
                .collect(Collectors.groupingBy(Category::getParentId));
                
        return allCategories.stream()
                .filter(c -> c.getParentId() == null)
                .map(root -> buildCategoryNode(root, childrenMap))
                .collect(Collectors.toList());
    }

    private Map<String, Object> buildCategoryNode(Category category, Map<Long, List<Category>> childrenMap) {
        Map<String, Object> node = new HashMap<>();
        node.put("id", category.getId());
        node.put("name", category.getName());
        node.put("slug", category.getSlug());
        node.put("imageUrl", category.getImageUrl());
        node.put("description", category.getDescription());
        
        List<Category> children = childrenMap.get(category.getId());
        if (children != null && !children.isEmpty()) {
            List<Map<String, Object>> childrenNodes = children.stream()
                    .map(child -> buildCategoryNode(child, childrenMap))
                    .collect(Collectors.toList());
            node.put("children", childrenNodes);
        } else {
            node.put("children", java.util.Collections.emptyList());
        }
        return node;
    }

    private List<Long> getAllSubcategoryIds(Long categoryId, List<Category> allCategories) {
        List<Long> ids = new java.util.ArrayList<>();
        ids.add(categoryId);
        for (Category c : allCategories) {
            if (categoryId.equals(c.getParentId())) {
                ids.addAll(getAllSubcategoryIds(c.getId(), allCategories));
            }
        }
        return ids;
    }

    public Page<Product> searchProducts(String categorySlug, Long brandId, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, String keyword, Pageable pageable) {
        List<Long> categoryIds = null;
        boolean hasCategoryFilter = false;
        if (categorySlug != null && !categorySlug.trim().isEmpty() && !categorySlug.equalsIgnoreCase("tat-ca")) {
            Category category = categoryRepository.findBySlugAndIsActiveTrue(categorySlug).orElse(null);
            if (category != null) {
                hasCategoryFilter = true;
                List<Category> allCategories = categoryRepository.findByIsActiveTrueOrderByNameAsc();
                categoryIds = getAllSubcategoryIds(category.getId(), allCategories);
            } else {
                hasCategoryFilter = true;
                categoryIds = java.util.Collections.singletonList(-1L); // Trả về danh sách trống nếu slug danh mục không hợp lệ
            }
        }
        if (hasCategoryFilter) {
            return productRepository.searchProductsWithCategory(brandId, minPrice, maxPrice, keyword, categoryIds, pageable);
        } else {
            return productRepository.searchProductsWithoutCategory(brandId, minPrice, maxPrice, keyword, pageable);
        }
    }

    public List<String> suggestProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return productRepository.findByNameContainingIgnoreCaseOrModelCodeContainingIgnoreCase(
                keyword, keyword, org.springframework.data.domain.PageRequest.of(0, 10))
                .getContent().stream()
                .map(Product::getName)
                .distinct()
                .collect(Collectors.toList());
    }
    
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlugAndIsActiveTrue(slug)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
