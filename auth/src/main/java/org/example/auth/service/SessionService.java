package org.example.auth.service;

import org.example.auth.model.AuthSession;
import org.example.auth.repository.AuthSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SessionService {
    private final AuthSessionRepository authSessionRepository;
    private final SecurityPolicyService securityPolicyService;

    public SessionService(
            AuthSessionRepository authSessionRepository,
            SecurityPolicyService securityPolicyService) {
        this.authSessionRepository = authSessionRepository;
        this.securityPolicyService = securityPolicyService;
    }

    @Transactional
    public AuthSession createSession(String userId, String jwtToken, String ipAddress, String userAgent) {
        AuthSession session = new AuthSession();
        session.setUserId(userId);
        session.setJwtToken(jwtToken);
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        session.setStatus("active");
        
        // Используем session_timeout_minutes из security_policy
        int timeoutMinutes = securityPolicyService.getSessionTimeoutMinutes();
        session.setExpiresAt(LocalDateTime.now().plusMinutes(timeoutMinutes));
        
        return authSessionRepository.save(session);
    }

    @Transactional
    public void invalidateSession(String sessionId) {
        authSessionRepository.findById(sessionId).ifPresent(session -> {
            session.setStatus("inactive");
            authSessionRepository.save(session);
        });
    }

    @Transactional
    public void invalidateUserSessions(String userId) {
        authSessionRepository.invalidateUserSessions(userId);
    }

    @Transactional
    public void invalidateSessionByToken(String token) {
        authSessionRepository.findByJwtToken(token).ifPresent(session -> {
            session.setStatus("inactive");
            authSessionRepository.save(session);
        });
    }

    public boolean isSessionValid(String token) {
        return authSessionRepository.findByJwtToken(token)
                .map(session -> "active".equals(session.getStatus()) 
                    && session.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(false);
    }
}

