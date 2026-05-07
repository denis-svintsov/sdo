package com.example.communication.repository;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

@Repository
public class CourseAssignmentAccessRepository {

    private final EntityManager entityManager;

    public CourseAssignmentAccessRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public boolean hasAssignment(String userId, String courseId) {
        if (userId == null || userId.isBlank() || courseId == null || courseId.isBlank()) {
            return false;
        }
        String sql = """
                select 1
                from courses.course_assignment ca
                where ca.user_id = :userId
                  and ca.course_id = :courseId
                limit 1
                """;
        return !entityManager.createNativeQuery(sql)
                .setParameter("userId", userId)
                .setParameter("courseId", courseId)
                .getResultList()
                .isEmpty();
    }
}
