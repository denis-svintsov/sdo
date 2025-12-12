package org.example.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "security_policy", schema = "auth")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecurityPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "policy_id")
    private String policyId;

    @Column(name = "policy_name", nullable = false, unique = true)
    private String policyName;

    @Column(name = "max_login_attempts")
    private Integer maxLoginAttempts = 5;

    @Column(name = "password_min_length")
    private Integer passwordMinLength = 8;

    @Column(name = "session_timeout_minutes")
    private Integer sessionTimeoutMinutes = 1440;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}



