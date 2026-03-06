package org.example.courses.repository;

import org.example.courses.model.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseModuleRepository extends JpaRepository<CourseModule, String> {

    List<CourseModule> findByCourseIdOrderByOrderIndexAsc(String courseId);
}

