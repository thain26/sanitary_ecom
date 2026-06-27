package com.sanitary.ecommerce.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlugAndIsActiveTrue(String slug);
    
    List<Product> findByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc();

    Page<Product> findByNameContainingIgnoreCaseOrModelCodeContainingIgnoreCase(String name, String modelCode, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:active IS NULL OR p.isActive = :active) AND " +
           "(COALESCE(:keyword, '') = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.modelCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.category.id IN :categoryIds")
    Page<Product> searchAdminProductsWithCategory(@Param("keyword") String keyword, 
                                                  @Param("categoryIds") List<Long> categoryIds, 
                                                  @Param("brandId") Long brandId, 
                                                  @Param("active") Boolean active, 
                                                  Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:active IS NULL OR p.isActive = :active) AND " +
           "(COALESCE(:keyword, '') = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.modelCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchAdminProductsWithoutCategory(@Param("keyword") String keyword, 
                                                     @Param("brandId") Long brandId, 
                                                     @Param("active") Boolean active, 
                                                     Pageable pageable);

    List<Product> findByStockLessThanEqualOrderByStockAsc(int stock);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:minPrice IS NULL OR COALESCE(p.salePrice, p.basePrice) >= :minPrice) AND " +
           "(:maxPrice IS NULL OR COALESCE(p.salePrice, p.basePrice) <= :maxPrice) AND " +
           "(COALESCE(:keyword, '') = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.modelCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.category.id IN :categoryIds")
    Page<Product> searchProductsWithCategory(@Param("brandId") Long brandId, 
                                             @Param("minPrice") java.math.BigDecimal minPrice,
                                             @Param("maxPrice") java.math.BigDecimal maxPrice,
                                             @Param("keyword") String keyword, 
                                             @Param("categoryIds") List<Long> categoryIds,
                                             Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:minPrice IS NULL OR COALESCE(p.salePrice, p.basePrice) >= :minPrice) AND " +
           "(:maxPrice IS NULL OR COALESCE(p.salePrice, p.basePrice) <= :maxPrice) AND " +
           "(COALESCE(:keyword, '') = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.modelCode) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProductsWithoutCategory(@Param("brandId") Long brandId, 
                                                @Param("minPrice") java.math.BigDecimal minPrice,
                                                @Param("maxPrice") java.math.BigDecimal maxPrice,
                                                @Param("keyword") String keyword, 
                                                Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.brand LEFT JOIN FETCH p.category LEFT JOIN FETCH p.images " +
           "WHERE p.isActive = true " +
           "AND (:brandId IS NULL OR p.brand.id = :brandId) " +
           "AND (:minPrice IS NULL OR COALESCE(p.salePrice, p.basePrice) >= :minPrice) " +
           "AND (:maxPrice IS NULL OR COALESCE(p.salePrice, p.basePrice) <= :maxPrice) " +
           "AND (COALESCE(:keyword, '') = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(p.detail) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(p.modelCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (COALESCE(:categoryName, '') = '' OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :categoryName, '%'))) " +
           "ORDER BY p.isFeatured DESC, p.soldCount DESC")
    List<Product> findForAIContext(@Param("brandId") Long brandId,
                                   @Param("minPrice") java.math.BigDecimal minPrice,
                                   @Param("maxPrice") java.math.BigDecimal maxPrice,
                                   @Param("keyword") String keyword,
                                   @Param("categoryName") String categoryName,
                                   Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.brand LEFT JOIN FETCH p.category LEFT JOIN FETCH p.images " +
           "WHERE p.isActive = true AND p.isFeatured = true ORDER BY p.soldCount DESC")
    List<Product> findFeaturedForAI(Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock - :qty, p.soldCount = p.soldCount + :qty WHERE p.id = :id AND p.stock >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") int qty);
}
