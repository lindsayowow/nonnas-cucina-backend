package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.LoginDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.security.JwtUtil;
import org.launchcode.nonna.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            User user = userService.validateLogin(dto.getEmail(), dto.getPassword());
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            // Return JSON error instead of plain text
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
