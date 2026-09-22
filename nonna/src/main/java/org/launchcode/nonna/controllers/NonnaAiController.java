package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.NonnaMessageRequestDTO;
import org.launchcode.nonna.dtos.NonnaMessageResponseDTO;
import org.launchcode.nonna.services.NonnaAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/* CORS handled globally by SecurityConfig's CorsConfigurationSource  */
@RestController
@RequestMapping("/gemini")
public class NonnaAiController {

    private final NonnaAiService nonnaAiService;

    public NonnaAiController(NonnaAiService nonnaAiService) {
        this.nonnaAiService = nonnaAiService;
    }

    // Accepts a NonnaMessageRequestDTO and returns a Gemini-generated message.
    @PostMapping
    public ResponseEntity<NonnaMessageResponseDTO> generateNonnaMessage(
            @RequestBody NonnaMessageRequestDTO request
    ) {
        String message = nonnaAiService.generateMessage(request);

        // Wrap model output in a DTO and return HTTP 200
        return ResponseEntity.ok(new NonnaMessageResponseDTO(message));
    }
}
