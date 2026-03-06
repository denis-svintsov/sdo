package org.example.courses.repository;

import org.example.courses.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {

    List<Enrollment> findByUserId(String userId);
}

