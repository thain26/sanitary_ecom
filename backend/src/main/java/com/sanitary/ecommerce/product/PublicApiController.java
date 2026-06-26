package com.sanitary.ecommerce.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final PublicApiService publicApiService;
    private final com.sanitary.ecommerce.promotion.FlashSaleRepository flashSaleRepository;
    private final com.sanitary.ecommerce.promotion.FlashSaleProductRepository flashSaleProductRepository;
    private final CollectionRepository collectionRepository;

    public PublicApiController(
            PublicApiService publicApiService, 
            com.sanitary.ecommerce.promotion.FlashSaleRepository flashSaleRepository,
            com.sanitary.ecommerce.promotion.FlashSaleProductRepository flashSaleProductRepository,
            CollectionRepository collectionRepository) {
        this.publicApiService = publicApiService;
        this.flashSaleRepository = flashSaleRepository;
        this.flashSaleProductRepository = flashSaleProductRepository;
        this.collectionRepository = collectionRepository;
    }

    @GetMapping("/home")
    public Map<String, Object> getHomeData() {
        return publicApiService.getHomeData();
    }

    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return publicApiService.getCategoryTree();
    }

    @GetMapping("/brands")
    public List<Brand> getBrands() {
        return publicApiService.getBrands();
    }

    @GetMapping("/products")
    public Page<Product> getProducts(
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        String[] sortParts = sort.split(",");
        String sortField = sortParts[0];
        Sort.Direction sortDirection = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        return publicApiService.searchProducts(categorySlug, brandId, minPrice, maxPrice, keyword, pageable);
    }

    @GetMapping("/products/suggest")
    public List<String> suggestProducts(@RequestParam String keyword) {
        return publicApiService.suggestProducts(keyword);
    }

    @GetMapping("/products/{slug}")
    public Product getProductBySlug(@PathVariable String slug) {
        return publicApiService.getProductBySlug(slug);
    }

    // ─── Collection Endpoints ───────────────────────────────────────────────

    @GetMapping("/collections")
    public List<Collection> getCollections() {
        return collectionRepository.findByIsActiveTrueOrderByIdAsc();
    }

    @GetMapping("/collections/hero-banners")
    public List<Collection> getHeroBannerCollections() {
        return collectionRepository.findByShowOnHeroBannerTrueAndIsActiveTrueOrderByIdAsc();
    }

    @GetMapping("/collections/{slug}")
    public org.springframework.http.ResponseEntity<Collection> getCollectionBySlug(@PathVariable String slug) {
        return collectionRepository.findBySlugWithProducts(slug)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

}
