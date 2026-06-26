package com.sanitary.ecommerce.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final JavaMailSender mailSender;

    @Async
    @EventListener
    public void handleNotificationEvent(NotificationEvent event) {
        log.info("Processing notification event: {} for {}", event.getType(), event.getRecipientEmail());
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(event.getRecipientEmail());
            message.setSubject(event.getSubject());
            message.setText(event.getBody());
            
            mailSender.send(message);
            log.info("Email sent successfully to {}", event.getRecipientEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", event.getRecipientEmail(), e.getMessage());
        }
    }
}
