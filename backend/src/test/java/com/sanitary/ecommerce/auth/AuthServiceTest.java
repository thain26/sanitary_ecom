package com.sanitary.ecommerce.auth;

import com.sanitary.ecommerce.config.JwtService;
import com.sanitary.ecommerce.user.User;
import com.sanitary.ecommerce.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.ApplicationEventPublisher;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests cho AuthService.
 * Kiểm tra: đăng ký, đăng nhập, refresh token.
 * 
 * Lưu ý: JwtService không thể mock bằng Mockito inline trên Java 25+.
 * Sử dụng @Spy với real JwtService instance hoặc @MockitoSettings subclass mock.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    // JwtService được mock thủ công vì Mockito inline không hỗ trợ trên Java 25
    // Sử dụng spy với instance thật
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private org.springframework.data.redis.core.StringRedisTemplate stringRedisTemplate;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private AuthService authService;

    private User mockUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() throws Exception {
        // Tạo JwtService instance thật với test secret key
        jwtService = new JwtService();
        java.lang.reflect.Field secretField = JwtService.class.getDeclaredField("secretKey");
        secretField.setAccessible(true);
        secretField.set(jwtService, "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");

        java.lang.reflect.Field expirationField = JwtService.class.getDeclaredField("jwtExpiration");
        expirationField.setAccessible(true);
        expirationField.set(jwtService, 900000L);

        // Tạo AuthService với dependencies thật và mock kết hợp
        authService = new AuthService(userRepository, refreshTokenRepository, passwordEncoder, jwtService, authenticationManager, stringRedisTemplate, eventPublisher);

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("user@test.com");
        mockUser.setFullName("Nguyễn Văn Test");
        mockUser.setPhone("0901234567");
        mockUser.setRole("CUSTOMER");
        mockUser.setStatus("ACTIVE");
        mockUser.setPassword("$2a$10$hashedpassword");

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("user@test.com");
        registerRequest.setPassword("Password123");
        registerRequest.setFullName("Nguyễn Văn Test");
        registerRequest.setPhone("0901234567");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("user@test.com");
        loginRequest.setPassword("Password123");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 1: Đăng ký thành công - trả về AuthResponse với token
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 1: Đăng ký tài khoản thành công - trả về access token và refresh token")
    void register_Success_ReturnsAuthResponse() {
        // Arrange
        when(userRepository.existsByEmail("user@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("$2a$10$encoded");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-uuid-token");
        refreshToken.setUser(mockUser);
        refreshToken.setExpiresAt(OffsetDateTime.now().plusDays(7));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isEqualTo("refresh-uuid-token");
        assertThat(response.getEmail()).isEqualTo("user@test.com");
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
        verify(userRepository).save(any(User.class));
    }

    // ─────────────────────────────────────────────────────────
    // TEST 2: Đăng ký thất bại - email đã tồn tại
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 2: Đăng ký thất bại - email đã được sử dụng bởi tài khoản khác")
    void register_Fail_WhenEmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail("user@test.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email đã được sử dụng");

        verify(userRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────────────────
    // TEST 3: Đăng nhập thành công - trả về token mới
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 3: Đăng nhập thành công - trả về access token mới, hủy refresh token cũ")
    void login_Success_ReturnsNewTokens() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        // deleteByUserId is void - no stub needed, Mockito ignores void calls by default

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("new-refresh-token");
        refreshToken.setUser(mockUser);
        refreshToken.setExpiresAt(OffsetDateTime.now().plusDays(7));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response.getAccessToken()).isNotBlank(); // token thật từ JwtService
        assertThat(response.getRefreshToken()).isEqualTo("new-refresh-token");
        assertThat(response.getEmail()).isEqualTo("user@test.com");
        // Phải xóa refresh token cũ trước khi tạo mới
        verify(refreshTokenRepository).deleteByUserId(1L);
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    // ─────────────────────────────────────────────────────────
    // TEST 4: Đăng nhập thất bại - sai mật khẩu
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 4: Đăng nhập thất bại - AuthenticationManager ném exception khi sai thông tin")
    void login_Fail_WhenBadCredentials() {
        // Arrange
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);

        verify(userRepository, never()).findByEmail(any());
    }

    // ─────────────────────────────────────────────────────────
    // TEST 5: Refresh token thành công - trả về access token mới
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 5: Refresh token hợp lệ - trả về access token mới cho user")
    void refreshToken_Success_ReturnsNewAccessToken() {
        // Arrange
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("valid-refresh-token");
        refreshToken.setUser(mockUser);
        refreshToken.setExpiresAt(OffsetDateTime.now().plusDays(5)); // còn hạn

        RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
        refreshRequest.setRefreshToken("valid-refresh-token");

        when(refreshTokenRepository.findByToken("valid-refresh-token")).thenReturn(Optional.of(refreshToken));

        // Act
        AuthResponse response = authService.refreshToken(refreshRequest);

        // Assert
        assertThat(response.getAccessToken()).isNotBlank();
        assertThat(response.getRefreshToken()).isEqualTo("valid-refresh-token");
        assertThat(response.getEmail()).isEqualTo("user@test.com");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 6: Refresh token hết hạn - ném exception và xóa token
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 6: Refresh token đã hết hạn - xóa token và ném exception yêu cầu đăng nhập lại")
    void refreshToken_Fail_WhenTokenExpired() {
        // Arrange
        RefreshToken expiredToken = new RefreshToken();
        expiredToken.setToken("expired-refresh-token");
        expiredToken.setUser(mockUser);
        expiredToken.setExpiresAt(OffsetDateTime.now().minusDays(1)); // đã hết hạn

        RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
        refreshRequest.setRefreshToken("expired-refresh-token");

        when(refreshTokenRepository.findByToken("expired-refresh-token")).thenReturn(Optional.of(expiredToken));
        doNothing().when(refreshTokenRepository).delete(expiredToken);

        // Act & Assert
        assertThatThrownBy(() -> authService.refreshToken(refreshRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Refresh token đã hết hạn");

        verify(refreshTokenRepository).delete(expiredToken);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 7: Refresh token không tồn tại trong hệ thống
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 7: Refresh token không hợp lệ - không tìm thấy trong database")
    void refreshToken_Fail_WhenTokenNotFound() {
        // Arrange
        RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
        refreshRequest.setRefreshToken("non-existent-token");

        when(refreshTokenRepository.findByToken("non-existent-token")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.refreshToken(refreshRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Refresh token không hợp lệ");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 8: Đăng ký - mật khẩu được mã hóa trước khi lưu
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 8: Đăng ký tài khoản - mật khẩu phải được BCrypt encode trước khi lưu")
    void register_PasswordMustBeEncoded() {
        // Arrange
        when(userRepository.existsByEmail("user@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("$2a$10$ENCODED_HASH");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User saved = inv.getArgument(0);
            // Verify mật khẩu đã được encode, không phải plain text
            assertThat(saved.getPassword()).isEqualTo("$2a$10$ENCODED_HASH");
            assertThat(saved.getPassword()).doesNotContain("Password123");
            return mockUser;
        });

        RefreshToken rt = new RefreshToken();
        rt.setToken("rt");
        rt.setUser(mockUser);
        rt.setExpiresAt(OffsetDateTime.now().plusDays(7));
        when(refreshTokenRepository.save(any())).thenReturn(rt);

        // Act
        authService.register(registerRequest);

        // Assert
        verify(passwordEncoder).encode("Password123");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 9: Đăng ký - role mặc định phải là CUSTOMER
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 9: Đăng ký tài khoản mới phải gán role CUSTOMER theo mặc định")
    void register_NewUserHasCustomerRole() {
        // Arrange
        when(userRepository.existsByEmail("user@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User saved = inv.getArgument(0);
            assertThat(saved.getRole()).isEqualTo("CUSTOMER");
            assertThat(saved.getStatus()).isEqualTo("ACTIVE");
            return mockUser;
        });

        RefreshToken rt = new RefreshToken();
        rt.setToken("rt");
        rt.setUser(mockUser);
        rt.setExpiresAt(OffsetDateTime.now().plusDays(7));
        when(refreshTokenRepository.save(any())).thenReturn(rt);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 10: Đăng nhập - full name được trả về trong response
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 10: Đăng nhập thành công - AuthResponse chứa đầy đủ thông tin user")
    void login_Success_ResponseContainsUserInfo() {
        // Arrange
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        // deleteByUserId is void - no stub needed

        RefreshToken rt = new RefreshToken();
        rt.setToken("refresh-token");
        rt.setUser(mockUser);
        rt.setExpiresAt(OffsetDateTime.now().plusDays(7));
        when(refreshTokenRepository.save(any())).thenReturn(rt);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getFullName()).isEqualTo("Nguyễn Văn Test");
        assertThat(response.getPhone()).isEqualTo("0901234567");
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
    }
}
