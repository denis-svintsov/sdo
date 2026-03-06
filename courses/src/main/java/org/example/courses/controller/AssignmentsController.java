package org.example.courses.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.courses.dto.CourseAssignmentDto;
import org.example.courses.dto.CourseAssignmentRequest;
import org.example.courses.model.CourseAssignment;
import org.example.courses.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssignmentsController {

    private final AssignmentService assignmentService;

    /**
     * POST /courses/assign (по ТЗ)
     */
    @PostMapping("/courses/assign")
    public CourseAssignment assign(@Valid @RequestBody CourseAssignmentRequest req) {
        return assignmentService.assign(req);
    }

    /**
     * GET /users/{userId}/assigned-courses (по ТЗ)
     */
    @GetMapping("/users/{userId}/assigned-courses")
    public List<CourseAssignmentDto> assigned(@PathVariable String userId) {
        return toDtoList(userId);
    }

    /**
     * GET /courses/assigned-courses/my (через gateway, userId из заголовка)
     */
    @GetMapping("/courses/assigned-courses/my")
    public List<CourseAssignmentDto> myAssigned(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id");
        }
        return toDtoList(userId);
    }

    private List<CourseAssignmentDto> toDtoList(String userId) {
        return assignmentService.getAssignedCourses(userId).stream()
                .map(a -> new CourseAssignmentDto(
                        a.getId(),
                        a.getUserId(),
                        a.getCourse() != null ? a.getCourse().getId() : null,
                        a.getCourse() != null ? a.getCourse().getTitle() : null,
                        a.getCourse() != null ? a.getCourse().getDescription() : null,
                        a.getCourse() != null && a.getCourse().getCategory() != null ? a.getCourse().getCategory().getId() : null,
                        a.getCourse() != null ? a.getCourse().getDifficulty() : null,
                        a.getCourse() != null ? a.getCourse().getDurationMinutes() : null,
                        a.getCourse() != null ? a.getCourse().getStatus() : null,
                        a.getCourse() != null ? a.getCourse().getCoverUrl() : null,
                        a.getCourse() != null ? a.getCourse().getAggregatorUrl() : null,
                        a.getCourse() != null ? a.getCourse().getInstructions() : null,
                        a.getCourse() != null ? a.getCourse().getSpecialization() : null,
                        a.getCourse() != null ? a.getCourse().getCompanyCost() : null,
                        a.getAssignedBy(),
                        a.getDueDate(),
                        a.getStatus(),
                        a.getCreatedAt()
                ))
                .toList();
    }
}
