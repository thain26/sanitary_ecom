package com.sanitary.ecommerce.config;

import com.sanitary.ecommerce.user.entity.User;
import com.sanitary.ecommerce.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    @Value("${admin.default.password:admin123}")
    private String adminDefaultPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@sanitarystudio.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@sanitarystudio.com");
            admin.setPassword(passwordEncoder.encode(adminDefaultPassword));
            admin.setFullName("System Administrator");
            admin.setRole("ADMIN");
            admin.setStatus("ACTIVE");
            userRepository.save(admin);
            log.info("Admin user seeded: admin@sanitarystudio.com");
        }
    }
}
