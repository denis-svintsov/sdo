package org.example.auth.dto;

import java.util.List;

public record AuthValidationResponse(String userId, String username, List<String> roles) {
}
