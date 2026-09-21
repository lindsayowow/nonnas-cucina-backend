package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.NonnaMessageRequestDTO;
import org.launchcode.nonna.dtos.NonnaMessageResponseDTO;
import org.launchcode.nonna.services.NonnaAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing the Gemini Nonna message endpoint.
 * Frontend calls POST /gemini with state + ingredient data.
 *
 * CORS for this endpoint is handled globally by SecurityConfig's
 * CorsConfigurationSource (covers /**, including /gemini) -- no
 * per-controller @CrossOrigin needed here.
 */
@RestController
@RequestMapping("/gemini")
public class NonnaAiController {

    private final NonnaAiService nonnaAiService;

    public NonnaAiController(NonnaAiService nonnaAiService) {
        this.nonnaAiService = nonnaAiService;
    }

    /**
     * POST /gemini
     * Accepts a NonnaMessageRequestDTO and returns a Gemini-generated message.
     */
    @PostMapping
    public ResponseEntity<NonnaMessageResponseDTO> generateNonnaMessage(
            @RequestBody NonnaMessageRequestDTO request
    ) {
        String message = nonnaAiService.generateMessage(request);
        return ResponseEntity.ok(new NonnaMessageResponseDTO(message));
    }
}