package org.example.courses.controller;

import lombok.RequiredArgsConstructor;
import org.example.courses.model.Enrollment;
import org.example.courses.service.EnrollmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/enrollments")
public class EnrollmentsController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public List<Enrollment> my(@RequestHeader("X-User-Id") String userId) {
        return enrollmentService.myEnrollments(userId);
    }
}

