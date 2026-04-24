package com.smartcampus.backend.users.controller;

import com.smartcampus.backend.common.response.ApiResponse;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success("Users retrieved successfully", userService.getAllUsers());
    }

    @GetMapping("/pending")
    public ApiResponse<List<User>> getPendingRequests() {
        return ApiResponse.success("Pending requests retrieved successfully", userService.getPendingRequests());
    }

    @PostMapping("/{userId}/approve")
    public ApiResponse<String> approveUser(@PathVariable String userId) {
        userService.approveUser(userId);
        return ApiResponse.success("User access approved successfully", null);
    }

    @DeleteMapping("/{userId}/reject")
    public ApiResponse<String> rejectUser(@PathVariable String userId) {
        userService.rejectUser(userId);
        return ApiResponse.success("User access request rejected", null);
    }

    @PatchMapping("/{userId}/role")
    public ApiResponse<String> updateRole(@PathVariable String userId, @RequestParam String role) {
        userService.updateRole(userId, role);
        return ApiResponse.success("User role updated successfully", null);
    }
}
