package org.example.courses.kafka;

import java.time.OffsetDateTime;

public record CourseCompletedEvent(
        String userId,
        String courseId,
        OffsetDateTime timestamp
) {
}

