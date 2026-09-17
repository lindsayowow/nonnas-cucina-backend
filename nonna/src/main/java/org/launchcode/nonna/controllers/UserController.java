package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.ProfileDTO;
import org.launchcode.nonna.dtos.RegisterUserDTO;
import org.launchcode.nonna.dtos.UserDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET ALL USERS
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUserDTOs();
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public UserDTO getByUserDTOId(@PathVariable Integer id) {
        return userService.getByUserDTOId(id);
    }

    // GET PROFILE
    @GetMapping("/profile/{id}")
    public ProfileDTO getProfileDTOId(@PathVariable Integer id) {
        return userService.getByProfileDTOId(id);
    }

    // UPDATE USER (admin-level)
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Integer id, @RequestBody User user) {
        User updated = userService.updateUser(id, user);
        return new UserDTO(updated);
    }

    // UPDATE PROFILE
    @PutMapping("/profile/{id}")
    public ProfileDTO updateProfileDTO(@PathVariable Integer id, @RequestBody ProfileDTO profileDTO) {
        return userService.updateProfileDTO(id, profileDTO);
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    // REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterUserDTO dto) {
        UserDTO savedUser = userService.registerUser(dto);
        return ResponseEntity.status(201).body(savedUser);
    }
}
