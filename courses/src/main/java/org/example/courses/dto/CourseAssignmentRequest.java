package org.example.courses.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CourseAssignmentRequest(
        @NotBlank String userId,
        @NotBlank String courseId,
        /**
         * Идентификатор пользователя, назначившего курс (HR/Admin).
         */
        @NotBlank String assignedBy,
        @FutureOrPresent LocalDate dueDate
) {
}

