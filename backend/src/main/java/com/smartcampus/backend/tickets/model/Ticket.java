package com.smartcampus.backend.tickets.model;

// The Ticket class represents a maintenance ticket in the smart campus system. It includes fields for ticket details such as title, description, category, priority, status, user and technician information, location, timestamps, resolution notes, rating, and comments. The class is annotated with Lombok annotations for boilerplate code generation and is mapped to a MongoDB collection named "tickets". The nested Comment class represents individual comments on a ticket, including the user who made the comment, the message, and the timestamp.
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private String resourceId;
    private String resourceName;
    private String title;
    private String description; // Detailed description of the issue, including any relevant information that can help technicians understand and resolve the problem effectively.
    private String category; // TECHNICAL, FACILITY, OTHER
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
    private List<Comment> comments; // A list of comments associated with the ticket, allowing users and technicians to communicate and provide updates on the issue. Each comment includes the user ID, user name, message, and timestamp to track the conversation history related to the ticket.
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

    // The Comment class represents a comment made on a maintenance ticket. It includes fields for the user ID and name of the commenter, the message content of the comment, and a timestamp indicating when the comment was made. This allows for effective communication and tracking of updates related to a ticket, enabling both users and technicians to collaborate on resolving maintenance issues.
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
