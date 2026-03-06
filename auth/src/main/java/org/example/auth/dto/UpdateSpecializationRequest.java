package org.example.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateSpecializationRequest(
        @NotBlank(message = "Specialization is required") String specialization
) {
}
