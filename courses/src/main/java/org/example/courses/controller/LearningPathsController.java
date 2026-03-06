package org.example.courses.controller;

import lombok.RequiredArgsConstructor;
import org.example.courses.model.LearningPath;
import org.example.courses.service.LearningPathService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/learning-paths")
public class LearningPathsController {

    private final LearningPathService learningPathService;

    @GetMapping
    public List<LearningPath> list() {
        return learningPathService.list();
    }
}

