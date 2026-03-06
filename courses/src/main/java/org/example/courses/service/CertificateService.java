package org.example.courses.service;

import lombok.RequiredArgsConstructor;
import org.example.courses.model.Certificate;
import org.example.courses.model.Course;
import org.example.courses.repository.CertificateRepository;
import org.example.courses.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final CertificateGenerator certificateGenerator;

    public List<Certificate> myCertificates(String userId) {
        return certificateRepository.findByUserId(userId);
    }

    public Certificate get(String id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found: " + id));
    }

    /**
     * Создаёт сертификат при завершении курса, если его ещё нет.
     * Упрощённо: допускаем несколько сертификатов на один курс (в бою лучше ввести unique).
     */
    @Transactional
    public Certificate issueIfNeeded(String userId, String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        var gen = certificateGenerator.generate(userId, course.getTitle());
        Certificate cert = Certificate.builder()
                .userId(userId)
                .course(course)
                .issueDate(gen.issueDate())
                .pdfBytes(gen.pdfBytes())
                .hash(gen.hash())
                // заполним после сохранения
                .certificateUrl("pending")
                .build();
        Certificate saved = certificateRepository.save(cert);
        saved.setCertificateUrl("/certificates/" + saved.getId());
        return certificateRepository.save(saved);
    }
}

