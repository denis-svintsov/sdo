package org.example.courses.kafka;

import java.time.OffsetDateTime;

public record LessonCompletedEvent(
        String userId,
        String courseId,
        String lessonId,
        OffsetDateTime timestamp
) {
}

