package com.example.gateway;

import java.util.List;

public record AuthValidationResponse(String userId, String username, List<String> roles) {
}
