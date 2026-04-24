package com.smartcampus.backend.auth.service;

import com.smartcampus.backend.auth.dto.LoginRequest;
import com.smartcampus.backend.auth.dto.LoginResponse;
import com.smartcampus.backend.auth.dto.RegisterRequest;
import com.smartcampus.backend.config.JwtService;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        String identifier = request.getEmail() == null ? "" : request.getEmail().trim();

        User user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByNameIgnoreCase(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isApproved()) {
            throw new RuntimeException("Account pending approval");
        }

        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole()));
        
        return LoginResponse.builder()
                .token(token)
                .user(LoginResponse.UserData.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .build();
    }

    public void register(RegisterRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim();

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .faculty(request.getFaculty())
                .regNo(request.getRegNo())
                .academicYear(request.getAcademicYear())
                .purpose(request.getPurpose())
                .isApproved(false) // All new requests are pending
                .build();

        userRepository.save(user);
    }
}
