package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.LoginDTO;
import org.launchcode.nonna.dtos.UserDTO;
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

            // TEMP DEBUG — remove after diagnosing login issue
            System.out.println("[AUTH DEBUG] validateLogin succeeded for userId=" + user.getId());

            String token = jwtUtil.generateToken(user.getId());

            // TEMP DEBUG — remove after diagnosing login issue
            System.out.println("[AUTH DEBUG] token generated successfully, length=" + token.length());

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", new UserDTO(user)
                    )
            );

        } catch (RuntimeException e) {
            // TEMP DEBUG — remove after diagnosing login issue
            System.out.println("[AUTH DEBUG] caught exception type=" + e.getClass().getName());
            System.out.println("[AUTH DEBUG] caught exception message=" + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}