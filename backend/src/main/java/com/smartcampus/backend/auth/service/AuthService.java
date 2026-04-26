package com.smartcampus.backend.auth.service;

import com.smartcampus.backend.auth.dto.LoginRequest;
import com.smartcampus.backend.auth.dto.LoginResponse;
import com.smartcampus.backend.auth.dto.OAuthLoginRequest;
import com.smartcampus.backend.auth.dto.RegisterRequest;
import com.smartcampus.backend.config.JwtService;
import com.smartcampus.backend.notifications.service.NotificationService;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://www.googleapis.com")
            .build();

    @Value("${auth.student-email-domain:my.sliit.lk}")
    private String studentEmailDomain;

    @Value("${auth.staff-email-domain:sliit.lk}")
    private String staffEmailDomain;

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

        return buildLoginResponse(user);
    }

    public LoginResponse oauthLogin(OAuthLoginRequest request) {
        if (!"google".equalsIgnoreCase(request.getProvider())) {
            throw new RuntimeException("Unsupported OAuth provider");
        }

        GoogleUserInfo googleUser = restClient.get()
                .uri("/oauth2/v3/userinfo")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + request.getAccessToken())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(GoogleUserInfo.class);

        if (googleUser == null || googleUser.getEmail() == null || googleUser.getEmail().isBlank()) {
            throw new RuntimeException("Unable to verify Google account");
        }

        if (!Boolean.TRUE.equals(googleUser.getEmailVerified())) {
            throw new RuntimeException("Google account email is not verified");
        }

        String requestedRole = request.getRole() == null ? "" : request.getRole().trim().toUpperCase();
        if (!Set.of("USER", "").contains(requestedRole)) {
            throw new RuntimeException("Google sign-in is only available for Student/Staff accounts");
        }

        User user = userRepository.findByEmailIgnoreCase(googleUser.getEmail().trim())
                .map(existingUser -> ensureGoogleAccess(existingUser))
                .orElseGet(() -> createGoogleAccessUser(googleUser));

        if (!"USER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("This Google account is not linked to a Student/Staff login");
        }

        return buildLoginResponse(user);
    }

    public void register(RegisterRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim();

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (!"USER".equalsIgnoreCase(request.getRole())) {
            throw new RuntimeException("Only student and staff accounts can be requested through signup.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .department(request.getRegNo() == null || request.getRegNo().isBlank() ? "Staff" : "Student")
                .faculty(request.getFaculty())
                .regNo(request.getRegNo())
                .academicYear(request.getAcademicYear())
                .purpose(request.getPurpose())
                .isApproved(false) // All new requests are pending
                .build();

        User savedUser = userRepository.save(user);
        notifyAdminsAboutAccessRequest(savedUser);
    }

    private LoginResponse buildLoginResponse(User user) {
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

    private User ensureGoogleAccess(User user) {
        if (!"USER".equalsIgnoreCase(user.getRole())) {
            return user;
        }

        if (user.isApproved()) {
            return user;
        }

        user.setApproved(true);
        if (user.getPurpose() == null || user.getPurpose().isBlank()) {
            user.setPurpose("Auto-approved through Google sign-in");
        }

        return userRepository.save(user);
    }

    private User createGoogleAccessUser(GoogleUserInfo googleUser) {
        String email = googleUser.getEmail().trim().toLowerCase();
        String localPart = email.substring(0, email.indexOf('@'));

        User user = User.builder()
                .name(googleUser.getName() == null || googleUser.getName().isBlank() ? localPart : googleUser.getName().trim())
                .email(email)
                .password(passwordEncoder.encode("google-auth-only"))
                .role("USER")
                .department("Google User")
                .faculty("Google Workspace")
                .regNo(null)
                .academicYear(null)
                .purpose("Auto-created through Google sign-in")
                .isApproved(true)
                .build();

        return userRepository.save(user);
    }

    private void notifyAdminsAboutAccessRequest(User user) {
        for (User admin : userRepository.findByRoleIgnoreCase("ADMIN")) {
            notificationService.createNotification(
                    admin.getId(),
                    "New access request",
                    user.getEmail() + " submitted a student/staff access request for admin approval.",
                    "/admin/users"
            );
        }
    }

    @lombok.Data
    private static class GoogleUserInfo {
        private String email;
        private String name;
        private Boolean emailVerified;

        @com.fasterxml.jackson.annotation.JsonProperty("email_verified")
        public void setEmailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
        }
    }
}
