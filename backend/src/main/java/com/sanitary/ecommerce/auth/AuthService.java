package com.sanitary.ecommerce.auth;

import com.sanitary.ecommerce.config.JwtService;
import com.sanitary.ecommerce.notification.NotificationEvent;
import com.sanitary.ecommerce.user.entity.User;
import com.sanitary.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final RefreshTokenRepository refreshTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final StringRedisTemplate redisTemplate;
        private final ApplicationEventPublisher eventPublisher;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email đã được sử dụng");
                }

                User user = new User();
                user.setEmail(request.getEmail());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setFullName(request.getFullName());
                user.setPhone(request.getPhone());
                user.setRole("CUSTOMER");
                user.setStatus("ACTIVE");

                user = userRepository.save(user);

                String accessToken = jwtService.generateToken(user);
                RefreshToken refreshToken = createRefreshToken(user);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken.getToken())
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phone(user.getPhone())
                                .avatarUrl(user.getAvatarUrl())
                                .role(user.getRole())
                                .build();
        }

        @Transactional
        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khẩu không chính xác"));

                String accessToken = jwtService.generateToken(user);
                // Revoke old tokens
                refreshTokenRepository.deleteByUserId(user.getId());
                RefreshToken refreshToken = createRefreshToken(user);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken.getToken())
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phone(user.getPhone())
                                .avatarUrl(user.getAvatarUrl())
                                .role(user.getRole())
                                .build();
        }

        @Transactional
        public AuthResponse refreshToken(RefreshTokenRequest request) {
                RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                                .orElseThrow(() -> new RuntimeException(
                                                "Refresh token không hợp lệ hoặc không tồn tại"));

                if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
                        refreshTokenRepository.delete(token);
                        throw new RuntimeException("Refresh token đã hết hạn. Vui lòng đăng nhập lại");
                }

                User user = token.getUser();
                String accessToken = jwtService.generateToken(user);

                return AuthResponse.builder()
                                .accessToken(accessToken)
                                .refreshToken(token.getToken())
                                .id(user.getId())
                                .email(user.getEmail())
                                .fullName(user.getFullName())
                                .phone(user.getPhone())
                                .avatarUrl(user.getAvatarUrl())
                                .role(user.getRole())
                                .build();
        }

        public void forgotPassword(ForgotPasswordRequest request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

                // Generate 6-digit OTP
                String otp = String.format("%06d", new java.util.Random().nextInt(999999));

                // Save to Redis (valid for 5 minutes)
                redisTemplate.opsForValue().set("OTP:" + request.getEmail(), otp, 5,
                                java.util.concurrent.TimeUnit.MINUTES);

                // Send Email via RabbitMQ
                String body = "Xin chào " + user.getFullName() + ",\n\n"
                                + "Bạn đã yêu cầu đặt lại mật khẩu. Mã xác thực (OTP) của bạn là: " + otp + "\n"
                                + "Mã này có hiệu lực trong 5 phút.\n\n"
                                + "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.";

                com.sanitary.ecommerce.notification.NotificationEvent event = new com.sanitary.ecommerce.notification.NotificationEvent(
                                "FORGOT_PASSWORD", request.getEmail(), "Mã Xác Thực Quên Mật Khẩu - AQUALUX", body);
                eventPublisher.publishEvent(event);
        }

        @Transactional
        public void resetPassword(ResetPasswordRequest request) {
                String savedOtp = redisTemplate.opsForValue().get("OTP:" + request.getEmail());
                if (savedOtp == null || !savedOtp.equals(request.getOtp())) {
                        throw new RuntimeException("Mã xác thực không hợp lệ hoặc đã hết hạn");
                }

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                userRepository.save(user);

                // Delete OTP after successful reset
                redisTemplate.delete("OTP:" + request.getEmail());
        }

        private RefreshToken createRefreshToken(User user) {
                RefreshToken refreshToken = new RefreshToken();
                refreshToken.setUser(user);
                refreshToken.setToken(UUID.randomUUID().toString());
                refreshToken.setExpiresAt(OffsetDateTime.now().plusDays(7)); // 7 ngày
                return refreshTokenRepository.save(refreshToken);
        }
}
