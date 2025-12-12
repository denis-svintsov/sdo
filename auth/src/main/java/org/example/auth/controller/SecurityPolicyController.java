package org.example.auth.controller;

import org.example.auth.model.SecurityPolicy;
import org.example.auth.service.SecurityPolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/security-policy")
@CrossOrigin(origins = "*")
public class SecurityPolicyController {
    private final SecurityPolicyService securityPolicyService;

    public SecurityPolicyController(SecurityPolicyService securityPolicyService) {
        this.securityPolicyService = securityPolicyService;
    }

    @GetMapping("/default")
    public ResponseEntity<SecurityPolicy> getDefaultPolicy() {
        return ResponseEntity.ok(securityPolicyService.getDefaultPolicy());
    }

    @GetMapping("/password-min-length")
    public ResponseEntity<Map<String, Integer>> getPasswordMinLength() {
        return ResponseEntity.ok(Map.of("minLength", securityPolicyService.getPasswordMinLength()));
    }

    @GetMapping("/max-login-attempts")
    public ResponseEntity<Map<String, Integer>> getMaxLoginAttempts() {
        return ResponseEntity.ok(Map.of("maxAttempts", securityPolicyService.getMaxLoginAttempts()));
    }

    @GetMapping("/session-timeout")
    public ResponseEntity<Map<String, Integer>> getSessionTimeout() {
        return ResponseEntity.ok(Map.of("timeoutMinutes", securityPolicyService.getSessionTimeoutMinutes()));
    }
}

