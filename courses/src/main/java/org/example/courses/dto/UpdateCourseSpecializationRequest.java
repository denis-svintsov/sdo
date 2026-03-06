package org.example.courses.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateCourseSpecializationRequest(
        @NotBlank String specialization
) {
}
