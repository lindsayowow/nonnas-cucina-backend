package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.UserDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUserDTOs();
    }

    @GetMapping("/{id}")
    public UserDTO getByUserDTOId(@PathVariable int id) {
        return userService.getByUserDTOId(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }


}
