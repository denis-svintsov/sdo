package org.example.courses.dto;

public record UserCourseProgressDto(
        String courseId,
        String courseTitle,
        int completedLessons,
        int totalLessons,
        int progressPercentage
) {
}

