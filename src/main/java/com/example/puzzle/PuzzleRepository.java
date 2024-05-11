package com.example.puzzle;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface PuzzleRepository extends MongoRepository<Puzzle, String> {

    public Puzzle findByMessage(String message);
    
}