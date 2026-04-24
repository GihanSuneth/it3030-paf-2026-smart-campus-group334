package com.smartcampus.backend.users.service;

import com.smartcampus.backend.users.dto.CreateTechnicianRequest;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getPendingRequests() {
        return userRepository.findByIsApproved(false);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void approveUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
    }

    public void rejectUser(String userId) {
        userRepository.deleteById(userId);
    }

    public void updateRole(String userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        userRepository.save(user);
    }

    public User createTechnician(CreateTechnicianRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim();

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User technician = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role("TECHNICIAN")
                .department(request.getDepartment())
                .faculty("Technical Services")
                .purpose("Admin-created technician account")
                .isApproved(true)
                .build();

        return userRepository.save(technician);
    }
}
