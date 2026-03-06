package org.example.courses.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record UpdateCourseSpecializationRequest(
        @NotEmpty Set<String> specializations
) {
}
