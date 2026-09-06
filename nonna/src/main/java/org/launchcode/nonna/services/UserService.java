package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.RegisterUserDTO;
import org.launchcode.nonna.dtos.UserDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Connection to password encoder for hashing and verifying passwords
    private final PasswordEncoder passwordEncoder;

    // Constructor
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUserDTOs() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserDTO::new)
                .toList();
    }

    // outbound methods
    public UserDTO getByUserDTOId(int id) {
        return userRepository.findById(id)
                .map(UserDTO::new)
                .orElse(null);
    }

    // Connecting Repository to Model
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Methods for Model
    public User updateUser(Integer id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setEmail(updatedUser.getEmail());
        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        existing.setPhoneNumber(updatedUser.getPhoneNumber());

        return userRepository.save(existing);
    }

    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    public UserDTO registerUser(RegisterUserDTO dto) {

        // Validation checks - important on back end b/c front end can be bypassed
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email Address is required.");
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        if (dto.getFirstName() == null || dto.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First Name is required.");
        }

        if (dto.getLastName() == null || dto.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last Name is required.");
        }

        if (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank()) {
            throw new IllegalArgumentException("Phone Number is required.");
        }

        // Prevents dup entries
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("There is already an account registered with this email address.");
        }

        // Password requirements
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

        // Phone number requirement
        boolean hasLetter = false;
        for (char c : dto.getPhoneNumber().toCharArray()) {
            if (Character.isLetter(c)) {
                hasLetter = true;
                break;
            }
        }
        if (dto.getPhoneNumber().length() != 12
                || dto.getPhoneNumber().charAt(3) != '-'
                || dto.getPhoneNumber().charAt(7) != '-'
                || hasLetter
        ) {
            throw new IllegalArgumentException("Incorrect phone number format.");
        }

        // DTO setters
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPasswordHash(hashedPassword);

        // Saving new user in repo from front end
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser);
    }

    // EMAIL and password requirements
    public User validateLogin(String email, String password) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email address is required.");
        }

        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required.");
        }

        // Search method for user login, checks if username exists and verifies password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password."));

        boolean passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email address or password.");
        }

        return user;
    }
}
