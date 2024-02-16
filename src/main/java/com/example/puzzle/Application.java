package com.example.puzzle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application implements CommandLineRunner {

	@Autowired
	private PuzzleRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
	
		repository.deleteAll();
		repository.save(new Puzzle("Hello!"));

		System.out.println("Puzzles found:" );
		System.out.println("----------------");
		for (Puzzle puzzle : repository.findAll()) {
			System.out.println(puzzle);
		}		
	}
}
