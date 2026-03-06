package org.example.courses.service;

import lombok.RequiredArgsConstructor;
import org.example.courses.model.Course;
import org.example.courses.users.UserAccountRepository;
import org.example.courses.users.UserRoleRepository;
import org.example.courses.util.CsvUtil;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    private final UserAccountRepository userAccountRepository;
    private final UserRoleRepository userRoleRepository;

    public boolean canAccessCourse(String userId, Course course) {
        Set<String> allowedRoles = CsvUtil.splitToSet(course.getAllowedRolesCsv());
        Set<String> allowedDepartments = CsvUtil.splitToSet(course.getAllowedDepartmentIdsCsv());
        return canAccessCourse(userId, allowedRoles, allowedDepartments);
    }

    public boolean canAccessCourse(String userId, Set<String> allowedRoles, Set<String> allowedDepartments) {

        // Нет ограничений — доступно всем
        if (allowedRoles.isEmpty() && allowedDepartments.isEmpty()) {
            return true;
        }

        var user = userAccountRepository.findById(userId).orElse(null);
        if (user == null) return false;

        if (!allowedDepartments.isEmpty()) {
            String deptId = user.getDepartmentId();
            if (deptId == null || !allowedDepartments.contains(deptId)) {
                return false;
            }
        }

        if (!allowedRoles.isEmpty()) {
            Set<String> roles = userRoleRepository.findByUserId(userId).stream()
                    .map(r -> r.getRoleName() == null ? "" : r.getRoleName().trim().toUpperCase())
                    .filter(s -> !s.isBlank())
                    .collect(Collectors.toSet());
            // allowedRoles тоже нормализуем к верхнему регистру при сравнении
            Set<String> allowedNorm = allowedRoles.stream()
                    .map(s -> s.trim().toUpperCase())
                    .collect(Collectors.toSet());
            boolean ok = roles.stream().anyMatch(allowedNorm::contains);
            if (!ok) return false;
        }

        return true;
    }
}
