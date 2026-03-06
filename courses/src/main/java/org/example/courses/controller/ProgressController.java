package org.example.courses.controller;

import lombok.RequiredArgsConstructor;
import org.example.courses.dto.ProgressSummaryDto;
import org.example.courses.service.ProgressService;
import org.example.courses.util.SecurityHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/progress")
public class ProgressController {

    private final ProgressService progressService;

    /**
     * Личный кабинет с прогрессом.
     * userId в идеале брать из токена, здесь — через заголовок.
     */
    @GetMapping("/my")
    public ProgressSummaryDto my(@RequestHeader("X-User-Id") String userId) {
        return progressService.getMyProgress(userId);
    }

    /**
     * Прогресс пользователя (для HR).
     * Проверка ролей может быть добавлена через Security (как в auth), пока упрощённо.
     */
    @GetMapping("/users/{userId}")
    public ProgressSummaryDto user(@PathVariable String userId,
                                   @RequestHeader(name = "X-Roles", required = false) String rolesHeader) {
        Set<String> roles = SecurityHeaders.parseRoles(rolesHeader);
        if (!roles.contains("HR") && !roles.contains("ADMIN")) {
            throw new IllegalArgumentException("Access denied (HR/Admin only)");
        }
        return progressService.getUserProgress(userId);
    }
}

