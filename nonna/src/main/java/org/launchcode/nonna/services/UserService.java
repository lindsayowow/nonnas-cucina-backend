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

    public User updateUser(Integer id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existing.setUsername(updatedUser.getUsername());
        existing.setPasswordHash(updatedUser.getPasswordHash());
        existing.setEmail(updatedUser.getEmail());
        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        existing.setRole(updatedUser.getRole());
        existing.setStreetAddress(updatedUser.getStreetAddress());
        existing.setCity(updatedUser.getCity());
        existing.setState(updatedUser.getState());
        existing.setZipCode(updatedUser.getZipCode());
        existing.setPhoneNumber(updatedUser.getPhoneNumber());


        return userRepository.save(existing);
    }
    
    
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user);
    }

}
