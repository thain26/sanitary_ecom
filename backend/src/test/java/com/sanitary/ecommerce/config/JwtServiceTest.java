package com.sanitary.ecommerce.config;

import com.sanitary.ecommerce.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.*;

/**
 * Unit tests cho JwtService.
 * Kiểm tra: generate token, validate token, extract username, token hết hạn.
 * Không cần Spring Context - test thuần JUnit.
 */
@DisplayName("JwtService Unit Tests")
class JwtServiceTest {

    private JwtService jwtService;

    // Secret key hợp lệ dạng HEX 64 ký tự (256-bit)
    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();
        // Inject private fields qua reflection (vì không dùng Spring context)
        setField(jwtService, "secretKey", TEST_SECRET);
        setField(jwtService, "jwtExpiration", 900000L); // 15 phút
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private User buildUser(String email) {
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setFullName("Test User");
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");
        user.setPassword("encoded");
        return user;
    }

    // ─────────────────────────────────────────────────────────
    // TEST 1: generateToken trả về chuỗi JWT không rỗng
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 1: generateToken - trả về chuỗi JWT hợp lệ gồm 3 phần phân cách bằng dấu chấm")
    void generateToken_ReturnsValidJwtString() {
        // Arrange
        User user = buildUser("test@example.com");

        // Act
        String token = jwtService.generateToken(user);

        // Assert
        assertThat(token).isNotBlank();
        String[] parts = token.split("\\.");
        assertThat(parts).hasSize(3); // header.payload.signature
    }

    // ─────────────────────────────────────────────────────────
    // TEST 2: extractUsername trả về email của user
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 2: extractUsername - trích xuất đúng email từ JWT token")
    void extractUsername_ReturnsCorrectEmail() {
        // Arrange
        User user = buildUser("user@inax.com");
        String token = jwtService.generateToken(user);

        // Act
        String extractedUsername = jwtService.extractUsername(token);

        // Assert
        assertThat(extractedUsername).isEqualTo("user@inax.com");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 3: isTokenValid trả về true cho token hợp lệ
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 3: isTokenValid - trả về true khi token còn hạn và đúng user")
    void isTokenValid_ReturnsTrueForValidToken() {
        // Arrange
        User user = buildUser("valid@test.com");
        String token = jwtService.generateToken(user);

        // Act
        boolean isValid = jwtService.isTokenValid(token, user);

        // Assert
        assertThat(isValid).isTrue();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 4: isTokenValid trả về false khi token dùng cho user khác
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 4: isTokenValid - trả về false khi token thuộc user khác")
    void isTokenValid_ReturnsFalseForDifferentUser() {
        // Arrange
        User user1 = buildUser("user1@test.com");
        User user2 = buildUser("user2@test.com");
        String token = jwtService.generateToken(user1); // token của user1

        // Act
        boolean isValid = jwtService.isTokenValid(token, user2); // check với user2

        // Assert
        assertThat(isValid).isFalse();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 5: Token hết hạn bị báo invalid
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 5: Token đã hết hạn - isTokenValid ném exception hoặc trả về false")
    void expiredToken_IsNotValid() throws Exception {
        // Arrange: Tạo token với thời hạn -1 giây (đã hết hạn ngay lập tức)
        JwtService expiredService = new JwtService();
        setField(expiredService, "secretKey", TEST_SECRET);
        setField(expiredService, "jwtExpiration", -1000L); // hết hạn trong quá khứ

        User user = buildUser("expired@test.com");
        String expiredToken = expiredService.generateToken(user);

        // Act & Assert: Token đã hết hạn phải bị từ chối
        // isTokenExpired sẽ ném exception hoặc trả false
        assertThatThrownBy(() -> jwtService.isTokenValid(expiredToken, user))
                .isInstanceOf(Exception.class); // io.jsonwebtoken.ExpiredJwtException
    }

    // ─────────────────────────────────────────────────────────
    // TEST 6: Hai lần generate token cho cùng user tạo ra token khác nhau
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 6: Hai lần generate token cho cùng user tạo ra token khác nhau")
    void generateToken_ProducesDifferentTokensOverTime() throws InterruptedException {
        // Arrange
        User user = buildUser("multi@test.com");

        // Act
        String token1 = jwtService.generateToken(user);
        Thread.sleep(1100); // sleep 1.1 giây để issuedAt (seconds precision) khác nhau
        String token2 = jwtService.generateToken(user);

        // Assert: hai token phải khác nhau
        assertThat(token1).isNotEqualTo(token2);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 7: Token với extra claims chứa thêm dữ liệu tùy chỉnh
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 7: generateToken với extra claims - username vẫn được extract chính xác")
    void generateTokenWithExtraClaims_ExtractUsernameCorrectly() {
        // Arrange
        User user = buildUser("claims@test.com");
        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("role", "CUSTOMER");
        extraClaims.put("userId", 42L);

        // Act
        String token = jwtService.generateToken(extraClaims, user);
        String extractedUsername = jwtService.extractUsername(token);

        // Assert
        assertThat(extractedUsername).isEqualTo("claims@test.com");
        assertThat(token).isNotBlank();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 8: Token với user ADMIN - username vẫn là email
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 8: Admin user - token vẫn dùng email làm subject")
    void generateToken_ForAdminUser_UsesEmailAsSubject() {
        // Arrange
        User admin = new User();
        admin.setId(99L);
        admin.setEmail("admin@sanitary.com");
        admin.setRole("ADMIN");
        admin.setStatus("ACTIVE");
        admin.setPassword("encoded");
        admin.setFullName("Admin");

        // Act
        String token = jwtService.generateToken(admin);
        String username = jwtService.extractUsername(token);

        // Assert
        assertThat(username).isEqualTo("admin@sanitary.com");
        assertThat(jwtService.isTokenValid(token, admin)).isTrue();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 9: Token không hợp lệ (tampered) - extractUsername ném exception
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 9: Token bị giả mạo (tampered) - extractUsername ném exception bảo mật")
    void tamperedToken_ThrowsException() {
        // Arrange
        User user = buildUser("real@test.com");
        String validToken = jwtService.generateToken(user);

        // Giả mạo: thay đổi chữ ký (phần cuối)
        String tamperedToken = validToken.substring(0, validToken.lastIndexOf('.') + 1) + "FAKESIGNATURE";

        // Act & Assert
        assertThatThrownBy(() -> jwtService.extractUsername(tamperedToken))
                .isInstanceOf(Exception.class);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 10: isTokenValid với UserDetails là User entity - kiểm tra đầy đủ
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 10: isTokenValid với User entity implement UserDetails - xác thực hoàn chỉnh")
    void isTokenValid_WithUserEntityAsUserDetails() {
        // Arrange
        User user = buildUser("details@test.com");
        String token = jwtService.generateToken(user);

        // User implements UserDetails, getUsername() trả về email
        UserDetails userDetails = user;

        // Act
        boolean valid = jwtService.isTokenValid(token, userDetails);

        // Assert
        assertThat(valid).isTrue();
    }
}
