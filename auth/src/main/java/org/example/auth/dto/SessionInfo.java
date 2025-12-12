package org.example.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionInfo {
    private String sessionId;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String status;
    private String ipAddress;
    private String userAgent;
}

