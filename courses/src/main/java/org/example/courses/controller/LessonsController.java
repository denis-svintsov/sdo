package org.example.courses.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.courses.dto.LessonCompleteRequest;
import org.example.courses.model.UserProgress;
import org.example.courses.service.ProgressService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/lessons")
public class LessonsController {

    private final ProgressService progressService;

    /**
     * POST /lessons/{lessonId}/complete
     */
    @PostMapping("/{lessonId}/complete")
    public UserProgress complete(@PathVariable String lessonId, @Valid @RequestBody LessonCompleteRequest req) {
        return progressService.completeLesson(req.userId(), lessonId, req.timeSpentSeconds());
    }
}

