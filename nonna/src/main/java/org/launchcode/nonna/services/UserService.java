package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.ProfileDTO;
import org.launchcode.nonna.dtos.RegisterUserDTO;
import org.launchcode.nonna.dtos.UserDTO;
import org.launchcode.nonna.models.User;
import org.launchcode.nonna.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Convert into DTOs
    public List<UserDTO> getAllUserDTOs() {
        return userRepository.findAll()
                .stream()
                .map(UserDTO::new)
                .toList();
    }

    public UserDTO getByUserDTOId(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user);
    }

    public User updateUser(Integer id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Apply updates to basic fields
        existing.setEmail(updatedUser.getEmail());
        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        existing.setPhoneNumber(updatedUser.getPhoneNumber());

        // Update password only if provided and non-blank
        if (updatedUser.getPasswordHash() != null && !updatedUser.getPasswordHash().isBlank()) {
            existing.setPasswordHash(passwordEncoder.encode(updatedUser.getPasswordHash()));
        }

        // Save updated user
        return userRepository.save(existing);
    }

    // DELETE ACCOUNT (hard delete) -- only succeeds for users with no
    // PastOrder rows. If the user has order history, GlobalExceptionHandler gives
    // error 409. The frontend catches that and runs anonymizeUser
    // so order/kitchen-management data is never lost.
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // ANONYMIZE - Overwrites all identifying fields
    // with placeholder data and replaces the password hash with a
    // random, unusable value
    // will later be used for a "checkout as guest" feature as well
    public void anonymizeUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Replace data with placeholders
        user.setFirstName("Guest");
        user.setLastName("User");

        // email has to remain unique due to being username
        user.setEmail("nonnaskitchen+" + id + "@cucina.net");

        user.setPhoneNumber("000-000-0000");

        // Replace password with a random, unusable hash
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));

        userRepository.save(user);
    }

    public UserDTO registerUser(RegisterUserDTO dto) {

        // Prevent duplicate accounts
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }

        // Build new user
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        // Save and return DTO
        User saved = userRepository.save(user);
        return new UserDTO(saved);
    }

    // LOGIN VALIDATION by email or throw error
    public User validateLogin(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Validate password hash
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // GET PROFILE
    public ProfileDTO getByProfileDTOId(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build profile DTO
        return new ProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }

    // UPDATE PROFILE
    public ProfileDTO updateProfileDTO(Integer id, ProfileDTO profileDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Apply profile updates
        user.setFirstName(profileDTO.getFirstName());
        user.setLastName(profileDTO.getLastName());
        user.setEmail(profileDTO.getEmail());
        user.setPhoneNumber(profileDTO.getPhoneNumber());

        // Save updated user
        userRepository.save(user);

        // Return updated profile DTO
        return new ProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }
}
