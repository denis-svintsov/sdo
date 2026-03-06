package org.example.courses.dto;

import java.util.List;

public record ProgressSummaryDto(
        String userId,
        List<UserCourseProgressDto> courses
) {
}

