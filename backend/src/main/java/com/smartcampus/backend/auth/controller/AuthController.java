package com.smartcampus.backend.auth.controller;

import com.smartcampus.backend.auth.dto.LoginRequest;
import com.smartcampus.backend.auth.dto.LoginResponse;
import com.smartcampus.backend.auth.dto.OAuthLoginRequest;
import com.smartcampus.backend.auth.dto.RegisterRequest;
import com.smartcampus.backend.auth.service.AuthService;
import com.smartcampus.backend.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

