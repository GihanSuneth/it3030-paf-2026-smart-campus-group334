package com.smartcampus.backend.tickets.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String ticketCode;
    private String resourceId;
    private String resourceName;
    private String title;
    private String description;
    private String category; // EQUIPMENT, ACCESS, FACILITY
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private String status; // CREATED, UNDER_REVIEW, TECHNICIAN_ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    private String userId;
    private String userName;
    private String contactEmail;
    private String contactPhone;
    private String technicianId;
    private String technicianName;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime assignedAt;
    private LocalDateTime acknowledgedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime acceptedAt;
    private String resolutionNotes;
    private String configurationDone;
    private String suggestions;
    private String rejectionReason;
    private Boolean acceptedByUser;
    private Integer rating;
    private String ratingFeedback;
    private String ratingToken;
    @Builder.Default
    private List<String> attachments = new ArrayList<>();
    @Builder.Default
    private List<WorklogEntry> worklog = new ArrayList<>();
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorklogEntry {
        private String id;
        private String authorId;
        private String authorName;
        private String status;
        private String note;
        private LocalDateTime timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String userId;
        private String userName;
        private String message;
        private LocalDateTime timestamp;
    }
}
