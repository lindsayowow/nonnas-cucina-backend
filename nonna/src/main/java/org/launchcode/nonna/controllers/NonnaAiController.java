package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.NonnaMessageRequestDTO;
import org.launchcode.nonna.dtos.NonnaMessageResponseDTO;
import org.launchcode.nonna.services.NonnaAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/* REST controller exposing the Gemini Nonna message endpoint. */
@RestController
@RequestMapping("/gemini")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend dev server
public class NonnaAiController {

    private final NonnaAiService nonnaAiService;

    public NonnaAiController(NonnaAiService nonnaAiService) {
        this.nonnaAiService = nonnaAiService;
    }

    /* Accepts a NonnaMessageRequest and returns a Gemini-generated message.*/
    @PostMapping
    public ResponseEntity<NonnaMessageResponseDTO> generateNonnaMessage(
            @RequestBody NonnaMessageRequestDTO request
    ) {
        String message = nonnaAiService.generateMessage(request);
        return ResponseEntity.ok(new NonnaMessageResponseDTO(message));
    }
}
