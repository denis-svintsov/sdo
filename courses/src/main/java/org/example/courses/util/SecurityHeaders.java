package org.example.courses.util;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public final class SecurityHeaders {
    private SecurityHeaders() {}

    public static Set<String> parseRoles(String rolesHeader) {
        if (rolesHeader == null || rolesHeader.isBlank()) return Set.of();
        return Arrays.stream(rolesHeader.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toUpperCase)
                .collect(Collectors.toSet());
    }
}

