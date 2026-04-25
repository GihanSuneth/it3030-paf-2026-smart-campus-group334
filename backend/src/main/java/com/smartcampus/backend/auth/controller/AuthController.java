package com.smartcampus.backend.auth.controller;

import com.smartcampus.backend.auth.dto.LoginRequest;
import com.smartcampus.backend.auth.dto.LoginResponse;
import com.smartcampus.backend.auth.dto.RegisterRequest;
import com.smartcampus.backend.auth.service.AuthService;
import com.smartcampus.backend.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success("Access request submitted successfully", null);
    }
}
