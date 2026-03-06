package org.example.courses.service;

import lombok.RequiredArgsConstructor;
import org.example.courses.dto.CourseAssignmentRequest;
import org.example.courses.kafka.CourseAssignedEvent;
import org.example.courses.kafka.EventPublisher;
import org.example.courses.model.AssignmentStatus;
import org.example.courses.model.Course;
import org.example.courses.model.CourseAssignment;
import org.example.courses.model.Enrollment;
import org.example.courses.model.EnrollmentStatus;
import org.example.courses.repository.CourseAssignmentRepository;
import org.example.courses.repository.EnrollmentRepository;
import org.example.courses.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final CourseRepository courseRepository;
    private final CourseAssignmentRepository courseAssignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final EventPublisher eventPublisher;

    @Transactional
    public CourseAssignment assign(CourseAssignmentRequest req) {
        enforceQuarterLimit(req.userId());
        Course course = courseRepository.findById(req.courseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + req.courseId()));

        CourseAssignment assignment = CourseAssignment.builder()
                .userId(req.userId())
                .course(course)
                .assignedBy(req.assignedBy())
                .dueDate(req.dueDate())
                .status(AssignmentStatus.ASSIGNED)
                .build();
        CourseAssignment saved = courseAssignmentRepository.save(assignment);

        // На назначение создаём enrollment, если его ещё нет (упрощённо: допускаем дубликаты только в assignment,
        // но enrollment используем как "активную запись").
        Enrollment enrollment = Enrollment.builder()
                .userId(req.userId())
                .course(course)
                .status(EnrollmentStatus.ACTIVE)
                .build();
        enrollmentRepository.save(enrollment);

        eventPublisher.publishCourseAssigned(new CourseAssignedEvent(req.userId(), req.courseId(), req.assignedBy(), OffsetDateTime.now()));
        return saved;
    }

    public List<CourseAssignment> getAssignedCourses(String userId) {
        return courseAssignmentRepository.findByUserId(userId);
    }

    private void enforceQuarterLimit(String userId) {
        OffsetDateTime now = OffsetDateTime.now();
        int month = now.getMonthValue();
        int startMonth = ((month - 1) / 3) * 3 + 1;
        OffsetDateTime start = OffsetDateTime.of(
                now.getYear(),
                startMonth,
                1,
                0, 0, 0, 0,
                now.getOffset()
        );
        OffsetDateTime end = start.plusMonths(3);
        long count = courseAssignmentRepository.countByUserIdAndCreatedAtBetween(userId, start, end);
        if (count >= 3) {
            throw new IllegalStateException("Quarter limit reached. You can select up to 3 courses per quarter.");
        }
    }
}
