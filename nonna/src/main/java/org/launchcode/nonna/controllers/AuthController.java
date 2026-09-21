package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.LoginDTO;
import org.launchcode.nonna.dtos.UserDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.security.JwtUtil;
import org.launchcode.nonna.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController                     // REST controller (returns JSON)
@RequestMapping("/auth")           // Base URL path for all endpoints in this controller
public class AuthController {

    private final UserService userService;   // Service for validating login credentials
    private final JwtUtil jwtUtil;           // Utility for generating JWT tokens

    // Constructor injection for required services
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")         // Handles POST requests to /auth/login
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            // Validate user credentials using the service layer
            User user = userService.validateLogin(dto.getEmail(), dto.getPassword());

            // Generate a JWT token using the user's ID
            String token = jwtUtil.generateToken(user.getId());

            // Return a successful response containing both the token and user info
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", new UserDTO(user)
                    )
            );
        // If login fails, return a 400 Bad Request with an error message
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
            .body(Map.of("error", e.getMessage()));
        }
    }
}
