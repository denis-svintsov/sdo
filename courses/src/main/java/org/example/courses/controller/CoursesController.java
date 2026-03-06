package org.example.courses.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.courses.dto.CreateCourseRequest;
import org.example.courses.dto.CourseDto;
import org.example.courses.dto.UpdateCourseSpecializationRequest;
import org.example.courses.dto.UpdateCourseRequest;
import org.example.courses.model.CourseStatus;
import org.example.courses.model.DifficultyLevel;
import org.example.courses.service.AccessControlService;
import org.example.courses.service.AssignmentService;
import org.example.courses.service.CourseService;
import org.example.courses.users.UserAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/courses")
public class CoursesController {

    private final CourseService courseService;
    private final AccessControlService accessControlService;
    private final UserAccountRepository userAccountRepository;
    private final AssignmentService assignmentService;

    /**
     * Каталог курсов с поиском и фильтрацией.
     */
    @GetMapping
    public Page<CourseDto> catalog(@RequestParam(required = false) String q,
                                   @RequestParam(required = false) String categoryId,
                                   @RequestParam(required = false) DifficultyLevel difficulty,
                                   @RequestParam(required = false) CourseStatus status,
                                   @RequestParam(required = false) String tagId,
                                   @RequestParam(required = false) String specialization,
                                   @RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size,
                                   @RequestHeader(name = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        var pageResult = courseService.catalogDto(q, categoryId, difficulty, status, tagId, specialization, pageable);

        if (userId == null || userId.isBlank()) {
            return pageResult;
        }

        // Упрощённая фильтрация "после выборки" — корректнее делать это через join/spec,
        // но для MVP так быстрее.
        List<CourseDto> filtered = pageResult.getContent().stream()
                .filter(c -> accessControlService.canAccessCourse(userId, c.allowedRoles(), c.allowedDepartmentIds()))
                .collect(Collectors.toList());

        return new PageImpl<>(filtered, pageable, filtered.size());
    }

    /**
     * Рекомендованные курсы по специальности сотрудника.
     */
    @GetMapping("/recommended")
    public Page<CourseDto> recommended(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size,
                                       @RequestHeader(name = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        if (userId == null || userId.isBlank()) {
            return courseService.catalogDto(null, null, null, CourseStatus.ACTIVE, null, null, pageable);
        }
        var user = userAccountRepository.findById(userId).orElse(null);
        String specialization = user != null ? user.getSpecialization() : null;
        var pageResult = courseService.catalogDto(null, null, null, CourseStatus.ACTIVE, null, specialization, pageable);
        var assignedCourseIds = assignmentService.getAssignedCourses(userId).stream()
                .map(a -> a.getCourse() != null ? a.getCourse().getId() : null)
                .filter(id -> id != null && !id.isBlank())
                .collect(Collectors.toSet());
        List<CourseDto> filtered = pageResult.getContent().stream()
                .filter(c -> !assignedCourseIds.contains(c.id()))
                .filter(c -> accessControlService.canAccessCourse(userId, c.allowedRoles(), c.allowedDepartmentIds()))
                .collect(Collectors.toList());
        return new PageImpl<>(filtered, pageable, filtered.size());
    }

    @GetMapping("/{id}")
    public CourseDto get(@PathVariable String id,
                         @RequestHeader(name = "X-User-Id", required = false) String userId) {
        var course = courseService.getDtoById(id);
        if (userId != null && !accessControlService.canAccessCourse(userId, course.allowedRoles(), course.allowedDepartmentIds())) {
            throw new IllegalArgumentException("Access denied to course: " + id);
        }
        return course;
    }

    /**
     * Создать курс (HR/Admin).
     */
    @PostMapping
    public CourseDto create(@Valid @RequestBody CreateCourseRequest req) {
        return courseService.getDtoById(courseService.create(req).getId());
    }

    @PutMapping("/{id}")
    public CourseDto update(@PathVariable String id, @Valid @RequestBody UpdateCourseRequest req) {
        return courseService.getDtoById(courseService.update(id, req).getId());
    }

    @PatchMapping("/{id}/specialization")
    public CourseDto updateSpecialization(@PathVariable String id,
                                          @Valid @RequestBody UpdateCourseSpecializationRequest req) {
        return courseService.getDtoById(courseService.updateSpecializations(id, req.specializations()).getId());
    }
}
