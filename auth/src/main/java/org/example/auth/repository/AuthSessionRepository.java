package org.example.auth.repository;

import org.example.auth.model.AuthSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, String> {
    List<AuthSession> findByUserIdAndStatus(String userId, String status);
    
    Optional<AuthSession> findByJwtToken(String jwtToken);
    
    @Modifying
    @Query("DELETE FROM AuthSession s WHERE s.expiresAt < :now")
    void deleteExpiredSessions(LocalDateTime now);
    
    @Modifying
    @Query("UPDATE AuthSession s SET s.status = 'inactive' WHERE s.userId = :userId AND s.status = 'active'")
    void invalidateUserSessions(String userId);
}



