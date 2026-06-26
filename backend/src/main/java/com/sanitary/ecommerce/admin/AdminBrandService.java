package com.sanitary.ecommerce.admin;

import com.sanitary.ecommerce.admin.dto.AdminBrandRequest;
import com.sanitary.ecommerce.product.Brand;
import com.sanitary.ecommerce.product.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminBrandService {

    private final BrandRepository brandRepository;

    @Transactional
    public Brand createBrand(AdminBrandRequest request) {
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());

        if (request.getSlug() == null || request.getSlug().trim().isEmpty()) {
            brand.setSlug(slugify(request.getName()));
        } else {
            brand.setSlug(request.getSlug());
        }
        brand.setActive(true);
        return brandRepository.save(brand);
    }

    @Transactional
    public Brand updateBrand(Long id, AdminBrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));
        brand.setName(request.getName());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        brand.setActive(request.isActive());

        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            brand.setSlug(request.getSlug());
        } else {
            brand.setSlug(slugify(request.getName()));
        }
        return brandRepository.save(brand);
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
