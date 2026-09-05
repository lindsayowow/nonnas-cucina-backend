package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.RegisterUserDTO;
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
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setUsername(updatedUser.getUsername());
        existing.setEmail(updatedUser.getEmail());
        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        //        ---------saving for use in future feature ----------
//        existing.setRole(updatedUser.getRole());
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

    public User registerUser(RegisterUserDTO dto) {

        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (dto.getFirstName() == null || dto.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First Name is required.");
        }

        if (dto.getLastName() == null || dto.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last Name is required.");
        }

        if (dto.getStreetAddress() == null || dto.getStreetAddress().isBlank()) {
            throw new IllegalArgumentException("Street Address is required.");
        }

        if (dto.getCity() == null || dto.getCity().isBlank()) {
            throw new IllegalArgumentException("City is required.");
        }

        if (dto.getState() == null || dto.getState().isBlank()) {
            throw new IllegalArgumentException("State is required.");
        }

        if (dto.getZipCode() == null || dto.getZipCode().isBlank()) {
            throw new IllegalArgumentException("Zip Code is required.");
        }

        if (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank()) {
            throw new IllegalArgumentException("Phone Number is required.");
        }

        if (dto.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters.");
        }

        boolean hasNumber = false;
        for (char c : dto.getPassword().toCharArray()) {
            if (Character.isDigit(c)) {
                hasNumber = true;
                break;
            }
        }
        if (!hasNumber) {
            throw new IllegalArgumentException("Password must contain a number.");
        }

        boolean hasSymbol = false;
        for (char c : dto.getPassword().toCharArray()) {
            if (!Character.isLetterOrDigit(c)) {
                hasSymbol = true;
                break;
            }
        }
        if (!hasSymbol) {
            throw new IllegalArgumentException("Password must contain a symbol.");
        }

        boolean hasUpperCase = false;
        for (char c : dto.getPassword().toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpperCase = true;
                break;
            }
        }
        if (!hasUpperCase) {
            throw new IllegalArgumentException("Password must contain an upper-case letter.");
        }

        boolean hasLowerCase = false;
        for (char c : dto.getPassword().toCharArray()) {
            if (Character.isLowerCase(c)) {
                hasLowerCase = true;
                break;
            }
        }
        if (!hasLowerCase) {
            throw new IllegalArgumentException("Password must contain a lower-case letter.");
        }

        return null;
    }


}
