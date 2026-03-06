package org.example.courses.repository;

import org.example.courses.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, String> {

    List<Certificate> findByUserId(String userId);
}

