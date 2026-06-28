package com.sanitary.ecommerce.promotion.repository;
import com.sanitary.ecommerce.promotion.entity.FlashSaleProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlashSaleProductRepository extends JpaRepository<FlashSaleProduct, Long> {

    List<FlashSaleProduct> findByFlashSaleId(Long flashSaleId);

    Optional<FlashSaleProduct> findByFlashSaleIdAndProductId(Long flashSaleId, Long productId);

    @Query("SELECT fp FROM FlashSaleProduct fp JOIN FETCH fp.product WHERE fp.flashSale.isActive = true AND fp.flashSale.startTime <= :now AND fp.flashSale.endTime >= :now AND fp.product.id = :productId ORDER BY fp.flashSale.startTime DESC")
    List<FlashSaleProduct> findActiveFlashSaleProducts(@Param("productId") Long productId, @Param("now") ZonedDateTime now);

    @Query("SELECT fp FROM FlashSaleProduct fp JOIN FETCH fp.product WHERE fp.flashSale.id = :flashSaleId")
    List<FlashSaleProduct> findByFlashSaleIdWithProduct(@Param("flashSaleId") Long flashSaleId);
}
