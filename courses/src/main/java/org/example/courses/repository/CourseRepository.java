package org.example.courses.repository;

import org.example.courses.model.Course;
import org.example.courses.model.CourseStatus;
import org.example.courses.model.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String>, JpaSpecificationExecutor<Course> {

    List<Course> findByStatus(CourseStatus status);

    List<Course> findByDifficulty(DifficultyLevel difficulty);
}

