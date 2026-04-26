package com.smartcampus.backend.notifications.service;

import com.smartcampus.backend.notifications.model.Notification;
import com.smartcampus.backend.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public List<Notification> getNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void createNotification(String userId, String title, String message, String link) {
        notificationRepository.save(Notification.builder()
                .userId(userId)
                .title(title)
                .message(message)
                .link(link)
                .createdAt(LocalDateTime.now())
                .readBy(new ArrayList<>())
                .build());
    }

    public void markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("You cannot modify this notification");
        }

        if (notification.getReadBy() == null) {
            notification.setReadBy(new ArrayList<>());
        }

        if (!notification.getReadBy().contains(userId)) {
            notification.getReadBy().add(userId);
        }

        notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification notification : notifications) {
            if (notification.getReadBy() == null) {
                notification.setReadBy(new ArrayList<>());
            }
            if (!notification.getReadBy().contains(userId)) {
                notification.getReadBy().add(userId);
            }
        }
        notificationRepository.saveAll(notifications);
    }
}
