package org.example.auth.service;

import org.example.auth.model.SecurityPolicy;
import org.example.auth.repository.LoginAttemptRepository;
import org.example.auth.repository.SecurityPolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SecurityPolicyService {
    private final SecurityPolicyRepository securityPolicyRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private static final String DEFAULT_POLICY_NAME = "default";
    private static final int BLOCK_DURATION_MINUTES = 15; // Время блокировки после превышения лимита

    public SecurityPolicyService(
            SecurityPolicyRepository securityPolicyRepository,
            LoginAttemptRepository loginAttemptRepository) {
        this.securityPolicyRepository = securityPolicyRepository;
        this.loginAttemptRepository = loginAttemptRepository;
    }

    public SecurityPolicy getDefaultPolicy() {
        return securityPolicyRepository.findByPolicyName(DEFAULT_POLICY_NAME)
                .orElseGet(() -> {
                    // Если политики нет, создаем дефолтную
                    SecurityPolicy policy = new SecurityPolicy();
                    policy.setPolicyName(DEFAULT_POLICY_NAME);
                    policy.setMaxLoginAttempts(5);
                    policy.setPasswordMinLength(8);
                    policy.setSessionTimeoutMinutes(1440);
                    return securityPolicyRepository.save(policy);
                });
    }

    public SecurityPolicy getPolicy(String policyName) {
        return securityPolicyRepository.findByPolicyName(policyName)
                .orElseGet(this::getDefaultPolicy);
    }

    /**
     * Проверяет, не превышен ли лимит неудачных попыток входа для email
     */
    public boolean isAccountLocked(String email) {
        SecurityPolicy policy = getDefaultPolicy();
        LocalDateTime since = LocalDateTime.now().minusMinutes(BLOCK_DURATION_MINUTES);
        
        long failedAttempts = loginAttemptRepository.countFailedAttemptsByEmailSince(email, since);
        return failedAttempts >= policy.getMaxLoginAttempts();
    }

    /**
     * Проверяет, не превышен ли лимит неудачных попыток входа для IP адреса
     */
    public boolean isIpBlocked(String ipAddress) {
        SecurityPolicy policy = getDefaultPolicy();
        LocalDateTime since = LocalDateTime.now().minusMinutes(BLOCK_DURATION_MINUTES);
        
        long failedAttempts = loginAttemptRepository.countFailedAttemptsByIpSince(ipAddress, since);
        return failedAttempts >= policy.getMaxLoginAttempts();
    }

    /**
     * Получает количество оставшихся попыток входа для email
     */
    public int getRemainingAttempts(String email) {
        SecurityPolicy policy = getDefaultPolicy();
        LocalDateTime since = LocalDateTime.now().minusMinutes(BLOCK_DURATION_MINUTES);
        
        long failedAttempts = loginAttemptRepository.countFailedAttemptsByEmailSince(email, since);
        return Math.max(0, (int)(policy.getMaxLoginAttempts() - failedAttempts));
    }

    /**
     * Проверяет минимальную длину пароля
     */
    public boolean isPasswordValid(String password) {
        SecurityPolicy policy = getDefaultPolicy();
        return password != null && password.length() >= policy.getPasswordMinLength();
    }

    /**
     * Получает минимальную длину пароля
     */
    public int getPasswordMinLength() {
        return getDefaultPolicy().getPasswordMinLength();
    }

    /**
     * Получает время жизни сессии в минутах
     */
    public int getSessionTimeoutMinutes() {
        return getDefaultPolicy().getSessionTimeoutMinutes();
    }

    /**
     * Получает максимальное количество попыток входа
     */
    public int getMaxLoginAttempts() {
        return getDefaultPolicy().getMaxLoginAttempts();
    }
}

