package org.example.courses.repository;

import org.example.courses.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, String> {

    List<UserProgress> findByUserId(String userId);

    List<UserProgress> findByUserIdAndCourseId(String userId, String courseId);

    Optional<UserProgress> findByUserIdAndLessonId(String userId, String lessonId);
}

