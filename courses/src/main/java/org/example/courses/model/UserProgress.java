package org.example.courses.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_progress", schema = "courses")
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProgressStatus status;

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage;

    /**
     * Общее затраченное время в секундах.
     */
    @Column(name = "time_spent_seconds", nullable = false)
    private Long timeSpentSeconds;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void preSave() {
        if (status == null) {
            status = ProgressStatus.NOT_STARTED;
        }
        if (progressPercentage == null) {
            progressPercentage = 0;
        }
        if (timeSpentSeconds == null) {
            timeSpentSeconds = 0L;
        }
        updatedAt = OffsetDateTime.now();
    }
}

