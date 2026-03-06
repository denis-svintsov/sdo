package org.example.courses.dto;

import java.time.OffsetDateTime;

public record CertificateDto(
        String id,
        String courseId,
        OffsetDateTime issueDate,
        String certificateUrl,
        String hash
) {
}

