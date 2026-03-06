package org.example.courses.service;

import lombok.RequiredArgsConstructor;
import org.example.courses.model.LearningPath;
import org.example.courses.repository.LearningPathRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningPathService {

    private final LearningPathRepository learningPathRepository;

    public List<LearningPath> list() {
        return learningPathRepository.findAll();
    }
}

