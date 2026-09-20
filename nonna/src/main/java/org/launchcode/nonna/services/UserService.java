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

        existing.setEmail(updatedUser.getEmail());
        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        existing.setPhoneNumber(updatedUser.getPhoneNumber());

        if (updatedUser.getPasswordHash() != null && !updatedUser.getPasswordHash().isBlank()) {
            existing.setPasswordHash(passwordEncoder.encode(updatedUser.getPasswordHash()));
        }

        return userRepository.save(existing);
    }

    // DELETE ACCOUNT (hard delete) -- only succeeds for users with no
    // PastOrder rows. If the user has order history, the user_id foreign
    // key on past_orders rejects the delete and Hibernate throws
    // DataIntegrityViolationException, which GlobalExceptionHandler turns
    // into a 409. The frontend catches that 409 and calls anonymizeUser
    // (below) instead, so order/kitchen-management data is never lost.
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // ANONYMIZE ACCOUNT (guest conversion) -- used instead of a hard delete
    // when the account has past orders, so PastOrder/Dish rows referencing
    // this user stay intact (order table stays stable for future kitchen
    // management / ingredient research). Overwrites all identifying fields
    // with guest placeholder data and replaces the password hash with a
    // random, unusable value so the account can no longer be logged into.
    // The same guest-identity shape can later seed a "checkout as guest"
    // flow.
    public void anonymizeUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName("Guest");
        user.setLastName("User");
        // Plus-addressed per user id to satisfy the unique email constraint
        // while staying obviously identifiable as a placeholder address.
        user.setEmail("nonnaskitchen+" + id + "@cucina.net");
        user.setPhoneNumber("000-000-0000");
        user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));

        userRepository.save(user);
    }

    // REGISTER USER
    public UserDTO registerUser(RegisterUserDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        User saved = userRepository.save(user);
        return new UserDTO(saved);
    }

    // LOGIN VALIDATION
    public User validateLogin(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // GET PROFILE
    public ProfileDTO getByProfileDTOId(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        user.setFirstName(profileDTO.getFirstName());
        user.setLastName(profileDTO.getLastName());
        user.setEmail(profileDTO.getEmail());
        user.setPhoneNumber(profileDTO.getPhoneNumber());

        userRepository.save(user);

        return new ProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }
}