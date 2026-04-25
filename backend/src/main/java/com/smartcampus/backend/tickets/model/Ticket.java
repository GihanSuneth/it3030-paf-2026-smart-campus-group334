package com.smartcampus.backend.tickets.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

// The Ticket class represents a maintenance ticket in the smart campus system. It includes fields for ticket details such as title, description, category, priority, status, user and technician information, location, timestamps, resolution notes, rating, and comments. The class is annotated with Lombok annotations for boilerplate code generation and is mapped to a MongoDB collection named "tickets". The nested Comment class represents individual comments on a ticket, including the user who made the comment, the message, and the timestamp.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String ticketCode;
    private String title;
    private String description;
    private String category; // TECHNICAL, FACILITY, OTHER
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private String status; // CREATED, UNDER_REVIEW, APPROVED, TECHNICIAN_ASSIGNED, RESOLVED, REJECTED
    private String userId;
    private String userName;
    private String technicianId;
    private String technicianName;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolutionNotes;
    private Integer rating;
    private List<Comment> comments;

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
