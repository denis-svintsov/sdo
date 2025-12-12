package org.example.auth.service;

import org.example.auth.model.LoginAttempt;
import org.example.auth.repository.LoginAttemptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginAttemptService {
    private final LoginAttemptRepository loginAttemptRepository;

    public LoginAttemptService(LoginAttemptRepository loginAttemptRepository) {
        this.loginAttemptRepository = loginAttemptRepository;
    }

    /**
     * Записывает попытку входа в отдельной транзакции,
     * которая не откатывается при исключениях в основной транзакции
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordLoginAttempt(String userId, String email, String ipAddress, boolean success) {
        try {
            LoginAttempt attempt = new LoginAttempt();
            attempt.setUserId(userId);
            attempt.setEmail(email);
            attempt.setIpAddress(ipAddress);
            attempt.setSuccess(success);
            
            loginAttemptRepository.save(attempt);
            loginAttemptRepository.flush(); // Принудительно сохраняем в БД
        } catch (Exception e) {
            // Логируем ошибку, но не пробрасываем исключение дальше,
            // чтобы не прерывать основной процесс аутентификации
            System.err.println("Failed to record login attempt: " + e.getMessage());
        }
    }
}

