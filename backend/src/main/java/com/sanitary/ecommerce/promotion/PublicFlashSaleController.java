package com.sanitary.ecommerce.promotion;
import com.sanitary.ecommerce.promotion.entity.FlashSale;
import com.sanitary.ecommerce.promotion.entity.FlashSaleProduct;
import com.sanitary.ecommerce.promotion.repository.FlashSaleProductRepository;
import com.sanitary.ecommerce.promotion.repository.FlashSaleRepository;

import com.sanitary.ecommerce.product.entity.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/flash-sales")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicFlashSaleController {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleProductRepository flashSaleProductRepository;

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveFlashSale() {
        ZonedDateTime now = ZonedDateTime.now();
        List<FlashSale> activeSales = flashSaleRepository.findActiveFlashSales(now);
        
        if (activeSales.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyMap());
        }

        FlashSale activeSale = activeSales.get(0);
        List<FlashSaleProduct> items = flashSaleProductRepository.findByFlashSaleIdWithProduct(activeSale.getId());

        List<Map<String, Object>> productList = items.stream().map(item -> {
            Map<String, Object> pMap = new HashMap<>();
            Product p = item.getProduct();
            pMap.put("id", item.getId());
            pMap.put("productId", p.getId());
            pMap.put("name", p.getName());
            pMap.put("slug", p.getSlug());
            pMap.put("modelCode", p.getModelCode());
            pMap.put("basePrice", p.getBasePrice());
            pMap.put("salePrice", item.getSalePrice());
            pMap.put("quantityLimit", item.getQuantityLimit());
            pMap.put("soldCount", item.getSoldCount());
            pMap.put("stock", p.getStock());
            pMap.put("imageUrl", (p.getImages() != null && !p.getImages().isEmpty()) ? p.getImages().get(0).getUrl() : null);
            return pMap;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("id", activeSale.getId());
        response.put("name", activeSale.getName());
        response.put("startTime", activeSale.getStartTime());
        response.put("endTime", activeSale.getEndTime());
        response.put("products", productList);

        return ResponseEntity.ok(response);
    }
}
