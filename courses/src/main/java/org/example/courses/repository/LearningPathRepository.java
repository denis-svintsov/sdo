package org.example.courses.repository;

import org.example.courses.model.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPathRepository extends JpaRepository<LearningPath, String> {
}

