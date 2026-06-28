package com.sanitary.ecommerce.product.repository;
import com.sanitary.ecommerce.product.entity.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {

    List<Collection> findByIsActiveTrueOrderByIdAsc();

    List<Collection> findByShowOnHeroBannerTrueAndIsActiveTrueOrderByIdAsc();

    Optional<Collection> findBySlugAndIsActiveTrue(String slug);

    @Query("SELECT c FROM Collection c LEFT JOIN FETCH c.products WHERE c.slug = :slug AND c.isActive = true")
    Optional<Collection> findBySlugWithProducts(String slug);

    @Query("SELECT c FROM Collection c LEFT JOIN FETCH c.products WHERE c.id = :id")
    Optional<Collection> findByIdWithProducts(Long id);

    @Query("SELECT DISTINCT c FROM Collection c LEFT JOIN FETCH c.products WHERE c.isActive = true ORDER BY c.id ASC")
    List<Collection> findAllWithProducts();
}
