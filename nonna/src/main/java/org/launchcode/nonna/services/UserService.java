package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.UserDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> getAllUserDTOs() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserDTO::new)
                .toList();
    }

    public UserDTO getByUserDTOId(int id) {
        return userRepository.findById(id)
                .map(UserDTO::new)
                .orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user);
    }

}
