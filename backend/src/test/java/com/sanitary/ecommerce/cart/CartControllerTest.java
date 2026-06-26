package com.sanitary.ecommerce.cart;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CartController Unit Tests")
class CartControllerTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartController cartController;

    @Test
    @DisplayName("getCart - Valid UUID should return Cart")
    void getCart_ValidUUID_ReturnsCart() {
        // Arrange
        String validUUID = "123e4567-e89b-12d3-a456-426614174000";
        Cart cart = new Cart();
        cart.setSessionId(validUUID);
        when(cartRepository.findBySessionId(validUUID)).thenReturn(Optional.of(cart));

        // Act
        ResponseEntity<?> response = cartController.getCart(validUUID);

        // Assert
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody()).isInstanceOf(Cart.class);
    }

    @Test
    @DisplayName("getCart - Invalid UUID should throw IllegalArgumentException")
    void getCart_InvalidUUID_ThrowsException() {
        // Arrange
        String invalidUUID = "invalid-session-string";

        // Act & Assert
        assertThatThrownBy(() -> cartController.getCart(invalidUUID))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid session ID format");
    }

    @Test
    @DisplayName("getCart - Null UUID should throw IllegalArgumentException")
    void getCart_NullUUID_ThrowsException() {
        // Arrange
        String nullUUID = null;

        // Act & Assert
        assertThatThrownBy(() -> cartController.getCart(nullUUID))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid session ID format");
    }
}
