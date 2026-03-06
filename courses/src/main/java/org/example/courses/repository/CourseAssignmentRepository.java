package org.example.courses.repository;

import org.example.courses.model.CourseAssignment;
import org.example.courses.model.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, String> {

    List<CourseAssignment> findByUserId(String userId);

    List<CourseAssignment> findByUserIdAndStatusIn(String userId, List<AssignmentStatus> statuses);

    List<CourseAssignment> findByUserIdAndCreatedAtBetween(String userId, OffsetDateTime from, OffsetDateTime to);

    long countByUserIdAndCreatedAtBetween(String userId, OffsetDateTime from, OffsetDateTime to);
}
