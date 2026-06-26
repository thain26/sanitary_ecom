package com.sanitary.ecommerce.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String type; // e.g., "ORDER_CONFIRMATION", "WELCOME_EMAIL"
    private String recipientEmail;
    private String subject;
    private String body;
}
