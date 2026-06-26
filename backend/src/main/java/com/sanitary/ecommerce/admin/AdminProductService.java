package com.sanitary.ecommerce.admin;

import com.sanitary.ecommerce.admin.dto.AdminProductRequest;
import com.sanitary.ecommerce.product.BrandRepository;
import com.sanitary.ecommerce.product.CategoryRepository;
import com.sanitary.ecommerce.product.Product;
import com.sanitary.ecommerce.product.ProductImage;
import com.sanitary.ecommerce.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional
    public Product createProduct(AdminProductRequest request) {
        Product product = new Product();
        mapRequestToProduct(request, product);
        
        if (product.getSlug() == null || product.getSlug().trim().isEmpty()) {
            product.setSlug(slugify(product.getName()));
        }
        
        product.setActive(true);
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, AdminProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        mapRequestToProduct(request, product);
        
        if (product.getSlug() == null || product.getSlug().trim().isEmpty()) {
            product.setSlug(slugify(product.getName()));
        }
        
        return productRepository.save(product);
    }
    
    private void mapRequestToProduct(AdminProductRequest request, Product product) {
        product.setName(request.getName());
        product.setModelCode(request.getModelCode());
        product.setSku(request.getSku());
        product.setDescription(request.getDescription());
        product.setDetail(request.getDetail());
        product.setBasePrice(request.getBasePrice());
        product.setSalePrice(request.getSalePrice());
        product.setStock(request.getStock());
        product.setFeatured(request.isFeatured());
        product.setActive(request.isActive());

        if (request.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(request.getCategoryId()).orElse(null));
        } else {
            product.setCategory(null);
        }

        if (request.getBrandId() != null) {
            product.setBrand(brandRepository.findById(request.getBrandId()).orElse(null));
        } else {
            product.setBrand(null);
        }

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            if (product.getImages() != null) {
                product.getImages().clear();
            } else {
                product.setImages(new ArrayList<>());
            }
            
            for (AdminProductRequest.ImageDto imgDto : request.getImages()) {
                ProductImage img = new ProductImage();
                img.setUrl(imgDto.getUrl());
                img.setPrimary(imgDto.isPrimary());
                img.setProduct(product);
                product.getImages().add(img);
            }
        }
    }

    private String slugify(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
