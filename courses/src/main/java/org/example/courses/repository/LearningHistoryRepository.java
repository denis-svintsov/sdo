package org.example.courses.repository;

import org.example.courses.model.LearningHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningHistoryRepository extends JpaRepository<LearningHistory, String> {

    List<LearningHistory> findByUserIdOrderByTimestampDesc(String userId);
}

