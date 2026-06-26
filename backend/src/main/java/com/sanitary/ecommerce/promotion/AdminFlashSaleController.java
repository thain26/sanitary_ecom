package com.sanitary.ecommerce.promotion;

import com.sanitary.ecommerce.product.Product;
import com.sanitary.ecommerce.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/flash-sales")
@RequiredArgsConstructor
@Transactional
public class AdminFlashSaleController {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleProductRepository flashSaleProductRepository;
    private final ProductRepository productRepository;

    // ─────────────────────────────────────────────────────────────
    // ADMIN ENDPOINTS
    // ─────────────────────────────────────────────────────────────


    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<FlashSale>> getAllFlashSales() {
        return ResponseEntity.ok(flashSaleRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        if (flashSale.isActive() && flashSale.getStartTime() == null) {
            flashSale.setStartTime(ZonedDateTime.now());
        }
        return ResponseEntity.ok(flashSaleRepository.save(flashSale));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashSale> updateFlashSale(@PathVariable Long id, @RequestBody FlashSale details) {
        FlashSale fs = flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flash Sale not found"));
        fs.setName(details.getName());
        fs.setStartTime(details.getStartTime());
        fs.setEndTime(details.getEndTime());
        fs.setActive(details.isActive());
        return ResponseEntity.ok(flashSaleRepository.save(fs));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlashSale(@PathVariable Long id) {
        FlashSale fs = flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flash Sale not found"));
        flashSaleRepository.delete(fs);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/products")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getFlashSaleProducts(@PathVariable Long id) {
        List<FlashSaleProduct> items = flashSaleProductRepository.findByFlashSaleIdWithProduct(id);
        List<Map<String, Object>> response = items.stream().map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("productId", item.getProduct().getId());
            map.put("name", item.getProduct().getName());
            map.put("modelCode", item.getProduct().getModelCode());
            map.put("basePrice", item.getProduct().getBasePrice());
            map.put("salePrice", item.getSalePrice());
            map.put("quantityLimit", item.getQuantityLimit());
            map.put("soldCount", item.getSoldCount());
            map.put("stock", item.getProduct().getStock());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/products")
    public ResponseEntity<FlashSaleProduct> addProductToFlashSale(
            @PathVariable Long id,
            @RequestBody Map<String, Object> req
    ) {
        FlashSale fs = flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flash Sale not found"));
        
        Long productId = Long.valueOf(req.get("productId").toString());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        BigDecimal salePrice = new BigDecimal(req.get("salePrice").toString());
        Integer quantityLimit = req.get("quantityLimit") != null ? Integer.valueOf(req.get("quantityLimit").toString()) : null;

        // Check if product is already in this flash sale
        Optional<FlashSaleProduct> existing = flashSaleProductRepository.findByFlashSaleIdAndProductId(id, productId);
        if (existing.isPresent()) {
            throw new RuntimeException("Product is already in this Flash Sale");
        }

        FlashSaleProduct fsp = new FlashSaleProduct();
        fsp.setFlashSale(fs);
        fsp.setProduct(product);
        fsp.setSalePrice(salePrice);
        fsp.setQuantityLimit(quantityLimit);
        fsp.setSoldCount(0);

        return ResponseEntity.ok(flashSaleProductRepository.save(fsp));
    }

    @PutMapping("/{id}/products/{fsProductId}")
    public ResponseEntity<FlashSaleProduct> updateFlashSaleProduct(
            @PathVariable Long id,
            @PathVariable Long fsProductId,
            @RequestBody Map<String, Object> req
    ) {
        FlashSaleProduct fsp = flashSaleProductRepository.findById(fsProductId)
                .orElseThrow(() -> new RuntimeException("Flash Sale Product not found"));
        
        if (!fsp.getFlashSale().getId().equals(id)) {
            throw new RuntimeException("Product does not belong to this Flash Sale");
        }

        if (req.containsKey("salePrice")) {
            fsp.setSalePrice(new BigDecimal(req.get("salePrice").toString()));
        }
        if (req.containsKey("quantityLimit")) {
            fsp.setQuantityLimit(req.get("quantityLimit") != null ? Integer.valueOf(req.get("quantityLimit").toString()) : null);
        }
        if (req.containsKey("soldCount")) {
            fsp.setSoldCount(Integer.parseInt(req.get("soldCount").toString()));
        }

        return ResponseEntity.ok(flashSaleProductRepository.save(fsp));
    }

    @DeleteMapping("/{id}/products/{fsProductId}")
    public ResponseEntity<Void> removeProductFromFlashSale(
            @PathVariable Long id,
            @PathVariable Long fsProductId
    ) {
        FlashSaleProduct fsp = flashSaleProductRepository.findById(fsProductId)
                .orElseThrow(() -> new RuntimeException("Flash Sale Product not found"));
        
        if (!fsp.getFlashSale().getId().equals(id)) {
            throw new RuntimeException("Product does not belong to this Flash Sale");
        }

        flashSaleProductRepository.delete(fsp);
        return ResponseEntity.noContent().build();
    }
}
