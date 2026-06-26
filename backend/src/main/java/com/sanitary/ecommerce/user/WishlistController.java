package com.sanitary.ecommerce.user;

import com.sanitary.ecommerce.product.Product;
import com.sanitary.ecommerce.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        List<Wishlist> list = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Product> products = list.stream()
                .map(Wishlist::getProduct)
                .toList();

        return ResponseEntity.ok(products);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Boolean> toggleWishlist(Principal principal, @PathVariable Long productId) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return ResponseEntity.ok(false); // Removed
        } else {
            Wishlist wishlist = new Wishlist();
            wishlist.setUserId(user.getId());
            wishlist.setProductId(product.getId());
            wishlistRepository.save(wishlist);
            return ResponseEntity.ok(true); // Added
        }
    }
}
