package org.example.auth.repository;

import org.example.auth.model.SecurityPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecurityPolicyRepository extends JpaRepository<SecurityPolicy, String> {
    Optional<SecurityPolicy> findByPolicyName(String policyName);
}



