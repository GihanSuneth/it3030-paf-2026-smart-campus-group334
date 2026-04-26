package com.smartcampus.backend.notifications.controller;

import com.smartcampus.backend.common.response.ApiResponse;
import com.smartcampus.backend.notifications.model.Notification;
import com.smartcampus.backend.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<Notification>> getNotifications(@RequestParam String userId) {
        return ApiResponse.success("Notifications retrieved successfully", notificationService.getNotifications(userId));
    }

    @PatchMapping("/{id}")
    public ApiResponse<String> markAsRead(@PathVariable String id, @RequestParam String userId) {
        notificationService.markAsRead(id, userId);
        return ApiResponse.success("Notification marked as read", null);
    }

    @PatchMapping("/read-all")
    public ApiResponse<String> markAllAsRead(@RequestParam String userId) {
        notificationService.markAllAsRead(userId);
        return ApiResponse.success("Notifications marked as read", null);
    }
}
