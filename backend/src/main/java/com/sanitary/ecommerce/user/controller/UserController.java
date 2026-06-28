package com.sanitary.ecommerce.user.controller;
import com.sanitary.ecommerce.user.UserAddress;
import com.sanitary.ecommerce.user.UserProfileDto;
import com.sanitary.ecommerce.user.UserService;
import com.sanitary.ecommerce.user.entity.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Principal principal) {
        return ResponseEntity.ok(userService.getProfileByEmail(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(Principal principal, @Valid @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), dto));
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<UserAddress>> getAddresses(Principal principal) {
        return ResponseEntity.ok(userService.getAddresses(principal.getName()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<UserAddress> addAddress(Principal principal, @Valid @RequestBody UserAddress address) {
        return ResponseEntity.ok(userService.addAddress(principal.getName(), address));
    }

    @PutMapping("/addresses/{id}")
    public ResponseEntity<UserAddress> updateAddress(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody UserAddress address
    ) {
        return ResponseEntity.ok(userService.updateAddress(principal.getName(), id, address));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(Principal principal, @PathVariable Long id) {
        userService.deleteAddress(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/addresses/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(Principal principal, @PathVariable Long id) {
        userService.setDefaultAddress(principal.getName(), id);
        return ResponseEntity.ok().build();
    }
}
