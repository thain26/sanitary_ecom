package com.sanitary.ecommerce.admin;

import com.sanitary.ecommerce.admin.dto.AdminCategoryRequest;
import com.sanitary.ecommerce.product.Category;
import com.sanitary.ecommerce.product.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public Category createCategory(AdminCategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setParentId(request.getParentId());
        category.setImageUrl(request.getImageUrl());
        category.setDescription(request.getDescription());

        if (request.getSlug() == null || request.getSlug().trim().isEmpty()) {
            category.setSlug(slugify(request.getName()));
        } else {
            category.setSlug(request.getSlug());
        }
        category.setActive(true);
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, AdminCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        category.setName(request.getName());
        category.setParentId(request.getParentId());
        category.setImageUrl(request.getImageUrl());
        category.setDescription(request.getDescription());

        category.setActive(request.isActive());
        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            category.setSlug(request.getSlug());
        } else {
            category.setSlug(slugify(request.getName()));
        }
        return categoryRepository.save(category);
    }

    private String slugify(String input) {
        if (input == null) return "";
        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        slug = slug.toLowerCase()
                .replaceAll("[đĐ]", "d")
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
        return slug;
    }
}
