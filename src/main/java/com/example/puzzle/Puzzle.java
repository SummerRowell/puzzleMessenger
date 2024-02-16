package com.example.puzzle;

import java.io.Serializable;

import org.springframework.data.annotation.Id;


public class Puzzle implements Serializable {

    @Id public String id;
    public String message;

    
    public Puzzle() {}

    public Puzzle(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return id;
    }

    public String getMessage(){
        return this.message;
    }
}
