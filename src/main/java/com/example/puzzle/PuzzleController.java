package com.example.puzzle;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.util.Optional;

@Controller
public class PuzzleController {

    @Autowired
    private PuzzleRepository repository;

    @GetMapping("/home")
    String indexView(){
        return "index";
    }

    @GetMapping("/puzzle/{id}")
    public ModelAndView homePage(Model model, @PathVariable String id) {
        if (id == "") {
            return new ModelAndView("/errorpage.html");
        }
        Optional<Puzzle> puzzle = repository.findById(id);
        if (puzzle.isPresent()) {
            Puzzle getPuzzle = puzzle.get();
            return new ModelAndView("puzzleview.html", "puzzle", getPuzzle);
        } else {
            return new ModelAndView("errorpage.html");
        }
    }

    @PostMapping("/puzzle")
    public void testpuzzle(@RequestParam String message, HttpServletResponse response) {
        Puzzle existingPuzzle = repository.findByMessage(message);
        if (existingPuzzle != null) {
            String puzzleID = existingPuzzle.id;
            String redirectURL = "puzzle/" + puzzleID;
            try {
                response.sendRedirect(redirectURL);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            Puzzle puzzle = new Puzzle(message);
            repository.save(puzzle);
            String puzzleID = puzzle.id;
            String redirectURL = "puzzle/" + puzzleID;
            try {
                response.sendRedirect(redirectURL);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @GetMapping("/error")
    public String errorMessage() {
        return "Something went wrong";
    }
}
