package org.example.courses.service;

import lombok.RequiredArgsConstructor;
import org.example.courses.model.Enrollment;
import org.example.courses.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public List<Enrollment> myEnrollments(String userId) {
        return enrollmentRepository.findByUserId(userId);
    }
}

