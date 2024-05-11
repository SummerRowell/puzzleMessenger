package com.example.puzzle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class Application implements CommandLineRunner {

	@Autowired
	private PuzzleRepository repository;

	@Value("${DB_USER}")
	private String DB_USER;

	@Value("${DB_PASSWORD}")
	private String DB_PASSWORD;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		for (Puzzle puzzle : repository.findAll()) {
			System.out.println(puzzle);
		}		
	}
}
