package org.example.courses.repository;

import org.example.courses.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, String> {

    List<Lesson> findByModuleCourseId(String courseId);
}

