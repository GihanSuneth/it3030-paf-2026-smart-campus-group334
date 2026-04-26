package com.smartcampus.backend.tickets.service;

import com.smartcampus.backend.notifications.service.NotificationService;
import com.smartcampus.backend.tickets.model.Ticket;
import com.smartcampus.backend.tickets.repository.TicketRepository;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private static final List<String> ALLOWED_CATEGORIES = List.of("EQUIPMENT", "ACCESS", "FACILITY");
    private static final List<String> ALLOWED_STATUSES = List.of(
            "CREATED",
            "UNDER_REVIEW",
            "TECHNICIAN_ASSIGNED",
            "ACKNOWLEDGED",
            "IN_PROGRESS",
            "RESOLVED",
            "CLOSED",
            "REJECTED"
    );

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Ticket> getUserTickets(String userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Ticket> getTechnicianTickets(String technicianId) {
        return ticketRepository.findByTechnicianIdOrderByUpdatedAtDesc(technicianId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket createTicket(Ticket ticket) {
        validateTicket(ticket);

        LocalDateTime now = LocalDateTime.now();
        ticket.setId(null);
        ticket.setTicketCode(generateTicketCode());
        ticket.setCategory(normalizeCategory(ticket.getCategory()));
        ticket.setStatus("CREATED");
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);
        ticket.setAssignedAt(null);
        ticket.setAcknowledgedAt(null);
        ticket.setResolvedAt(null);
        ticket.setClosedAt(null);
        ticket.setAcceptedAt(null);
        ticket.setAcceptedByUser(Boolean.FALSE);
        ticket.setTechnicianId(null);
        ticket.setTechnicianName(null);
        ticket.setResolutionNotes(blankToNull(ticket.getResolutionNotes()));
        ticket.setConfigurationDone(blankToNull(ticket.getConfigurationDone()));
        ticket.setSuggestions(blankToNull(ticket.getSuggestions()));
        ticket.setRejectionReason(null);
        ticket.setRating(null);
        ticket.setRatingFeedback(null);
        ticket.setRatingToken(null);
        ticket.setComments(ticket.getComments() == null ? new ArrayList<>() : ticket.getComments());
        ticket.setWorklog(ticket.getWorklog() == null ? new ArrayList<>() : ticket.getWorklog());
        ticket.setAttachments(ticket.getAttachments() == null ? new ArrayList<>() : ticket.getAttachments());

        Ticket saved = ticketRepository.save(ticket);
        addWorklog(saved, saved.getUserId(), saved.getUserName(), "CREATED", "Ticket created and submitted for admin review.");
        notifyAdmins(
                "New Ticket Submitted",
                saved.getTicketCode() + " is waiting for review from " + safe(saved.getUserName()) + ".",
                "/admin/tickets"
        );
        notifyUser(
                saved.getUserId(),
                "Ticket Submitted",
                saved.getTicketCode() + " was submitted successfully and is waiting for admin review.",
                "/tickets/" + saved.getId()
        );
        return ticketRepository.save(saved);
    }

    public Ticket updateStatus(String id, String status, String note, String actorId, String actorName) {
        Ticket ticket = getTicketById(id);
        String normalizedStatus = normalizeStatus(status);
        String normalizedNote = blankToNull(note);
        ticket.setStatus(normalizedStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if ("ACKNOWLEDGED".equals(normalizedStatus)) {
            ticket.setAcknowledgedAt(LocalDateTime.now());
        }

        if ("IN_PROGRESS".equals(normalizedStatus) && ticket.getAcknowledgedAt() == null) {
            ticket.setAcknowledgedAt(LocalDateTime.now());
        }

        if ("UNDER_REVIEW".equals(normalizedStatus)) {
            ticket.setTechnicianId(null);
            ticket.setTechnicianName(null);
            ticket.setAssignedAt(null);
        }

        if ("REJECTED".equals(normalizedStatus)) {
            ticket.setRejectionReason(requireText(note, "Rejection reason is required."));
        } else {
            ticket.setRejectionReason(null);
        }

        addWorklog(ticket, actorId, actorName, normalizedStatus, normalizedNote);
        Ticket saved = ticketRepository.save(ticket);

        if (!"RESOLVED".equals(normalizedStatus)) {
            String message = saved.getTicketCode() + " is now " + humanizeStatus(normalizedStatus) + ".";
            if ("REJECTED".equals(normalizedStatus)) {
                message = saved.getTicketCode() + " was rejected. Reason: " + saved.getRejectionReason();
            }
            notifyUser(saved.getUserId(),
                    "Ticket Status Updated",
                    message,
                    "/tickets/" + saved.getId());
        }

        if ("ACKNOWLEDGED".equals(normalizedStatus) || "IN_PROGRESS".equals(normalizedStatus) || "REJECTED".equals(normalizedStatus)) {
            notifyAdmins(
                    "Ticket Progress Updated",
                    saved.getTicketCode() + " is now " + humanizeStatus(normalizedStatus) + ".",
                    "/tickets/" + saved.getId()
            );
        }

        return saved;
    }

    public Ticket assignTechnician(String id, String techId, String techName) {
        Ticket ticket = getTicketById(id);
        User technician = userRepository.findById(techId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        ticket.setTechnicianId(technician.getId());
        ticket.setTechnicianName(blankToNull(techName) != null ? techName : technician.getName());
        ticket.setStatus("TECHNICIAN_ASSIGNED");
        ticket.setAssignedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        addWorklog(ticket, technician.getId(), technician.getName(), "TECHNICIAN_ASSIGNED", "Technician assigned to the ticket.");

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(
                technician.getId(),
                "New Ticket Assignment",
                saved.getTicketCode() + " has been assigned to you for action.",
                "/technician/tickets/" + saved.getId()
        );
        notifyUser(
                saved.getUserId(),
                "Technician Assigned",
                saved.getTicketCode() + " has been assigned to " + safe(saved.getTechnicianName()) + ".",
                "/tickets/" + saved.getId()
        );
        notifyAdmins(
                "Ticket Assigned",
                saved.getTicketCode() + " has been routed to " + safe(saved.getTechnicianName()) + ".",
                "/tickets/" + saved.getId()
        );

        return saved;
    }

    public Ticket resolveTicket(String id, String notes, String configurationDone, String suggestions, String actorId, String actorName) {
        Ticket ticket = getTicketById(id);
        ticket.setResolutionNotes(requireText(notes, "Resolution reason is required."));
        ticket.setConfigurationDone(requireText(configurationDone, "Configuration done details are required."));
        ticket.setSuggestions(requireText(suggestions, "Suggestions are required."));
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        addWorklog(ticket, actorId, actorName, "RESOLVED", "Resolution submitted by technician.");

        Ticket saved = ticketRepository.save(ticket);
        notifyUser(
                saved.getUserId(),
                "Ticket Resolved",
                saved.getTicketCode() + " has been resolved. Review the resolution and accept closure.",
                "/tickets/" + saved.getId()
        );
        notifyAdmins(
                "Ticket Resolved",
                saved.getTicketCode() + " has been resolved by " + safe(saved.getTechnicianName()) + ".",
                "/tickets/" + saved.getId()
        );
        return saved;
    }

    public Ticket acceptResolution(String id, String actorId, String actorName) {
        Ticket ticket = getTicketById(id);
        ticket.setAcceptedByUser(Boolean.TRUE);
        ticket.setAcceptedAt(LocalDateTime.now());
        ticket.setClosedAt(LocalDateTime.now());
        ticket.setStatus("CLOSED");
        ticket.setRatingToken(null);
        ticket.setUpdatedAt(LocalDateTime.now());
        addWorklog(ticket, actorId, actorName, "CLOSED", "User accepted the resolution and closed the ticket.");

        Ticket saved = ticketRepository.save(ticket);
        if (saved.getTechnicianId() != null) {
            notificationService.createNotification(
                    saved.getTechnicianId(),
                    "Ticket Closed",
                    saved.getTicketCode() + " has been accepted by the user. You can now share the rating QR.",
                    "/technician/tickets/" + saved.getId()
            );
        }
        notifyUser(
                saved.getUserId(),
                "Ticket Closed",
                saved.getTicketCode() + " has been closed. Wait for the technician to generate the rating token.",
                "/tickets/" + saved.getId()
        );
        notifyAdmins(
                "Ticket Closed",
                saved.getTicketCode() + " has been accepted by the user and closed.",
                "/tickets/" + saved.getId()
        );
        return saved;
    }

    public Ticket generateRatingToken(String id, String actorId, String actorName) {
        Ticket ticket = getTicketById(id);
        if (!List.of("RESOLVED", "CLOSED").contains(ticket.getStatus())) {
            throw new RuntimeException("A rating token can be generated only for resolved or closed tickets.");
        }
        if (ticket.getTechnicianId() == null) {
            throw new RuntimeException("Only technician-assigned tickets can create rating tokens.");
        }

        ticket.setRatingToken(generateShortToken());
        ticket.setUpdatedAt(LocalDateTime.now());
        addWorklog(ticket, actorId, actorName, "TOKEN_GENERATED", "Rating token generated for user feedback.");

        Ticket saved = ticketRepository.save(ticket);
        notifyUser(
                saved.getUserId(),
                "Rating Token Ready",
                saved.getTicketCode() + " is ready for service rating. Open the ticket details to rate the technician.",
                "/tickets/" + saved.getId()
        );
        return saved;
    }

    public Ticket submitRating(String id, String token, Integer rating, String feedback) {
        Ticket ticket = getTicketById(id);
        if (!List.of("RESOLVED", "CLOSED").contains(ticket.getStatus())) {
            throw new RuntimeException("Only resolved or closed tickets can be rated.");
        }
        if (ticket.getRatingToken() == null || !ticket.getRatingToken().equals(blankToNull(token))) {
            throw new RuntimeException("Invalid rating link for this ticket.");
        }
        if (ticket.getRating() != null) {
            throw new RuntimeException("This ticket has already been rated.");
        }
        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5.");
        }

        ticket.setRating(rating);
        ticket.setRatingFeedback(blankToNull(feedback));
        ticket.setUpdatedAt(LocalDateTime.now());
        addWorklog(ticket, ticket.getUserId(), ticket.getUserName(), "RATED", "Service rating submitted.");

        Ticket saved = ticketRepository.save(ticket);
        if (saved.getTechnicianId() != null) {
            notificationService.createNotification(
                    saved.getTechnicianId(),
                    "New Service Rating",
                    saved.getTicketCode() + " received a " + rating + "/5 rating.",
                    "/technician/tickets/" + saved.getId()
            );
        }
        notifyAdmins(
                "Technician Rated",
                saved.getTicketCode() + " received a " + rating + "/5 service rating.",
                "/tickets/" + saved.getId()
        );
        return saved;
    }

    public Ticket addComment(String id, Ticket.Comment comment) {
        Ticket ticket = getTicketById(id);
        comment.setTimestamp(LocalDateTime.now());
        if (ticket.getComments() == null) {
            ticket.setComments(new ArrayList<>());
        }
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public String generateTicketCode() {
        int nextNumber = ticketRepository.findAll().stream()
                .map(Ticket::getTicketCode)
                .map(this::extractTicketNumber)
                .max(Integer::compareTo)
                .orElse(1000) + 1;
        return "TK" + nextNumber;
    }

    private void validateTicket(Ticket ticket) {
        if (blankToNull(ticket.getResourceId()) == null) {
            throw new RuntimeException("Resource is required.");
        }
        if (blankToNull(ticket.getResourceName()) == null) {
            throw new RuntimeException("Resource name is required.");
        }
        if (blankToNull(ticket.getLocation()) == null) {
            throw new RuntimeException("Location is required.");
        }
        if (blankToNull(ticket.getTitle()) == null) {
            throw new RuntimeException("Issue summary is required.");
        }
        if (blankToNull(ticket.getDescription()) == null) {
            throw new RuntimeException("Brief description is required.");
        }
        if (blankToNull(ticket.getUserId()) == null || blankToNull(ticket.getUserName()) == null) {
            throw new RuntimeException("User details are required.");
        }
        if (blankToNull(ticket.getContactEmail()) == null) {
            throw new RuntimeException("Contact email is required.");
        }
        if (blankToNull(ticket.getContactPhone()) == null) {
            throw new RuntimeException("Cell number is required.");
        }
        normalizeCategory(ticket.getCategory());
    }

    private String normalizeCategory(String value) {
        String normalized = requireText(value, "Category is required.").toUpperCase();
        if (!ALLOWED_CATEGORIES.contains(normalized)) {
            throw new RuntimeException("Category must be Equipment, Access, or Facility.");
        }
        return normalized;
    }

    private String normalizeStatus(String value) {
        String normalized = requireText(value, "Status is required.").toUpperCase();
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new RuntimeException("Unsupported ticket status.");
        }
        return normalized;
    }

    private void addWorklog(Ticket ticket, String actorId, String actorName, String status, String note) {
        if (ticket.getWorklog() == null) {
            ticket.setWorklog(new ArrayList<>());
        }
        ticket.getWorklog().add(Ticket.WorklogEntry.builder()
                .id(UUID.randomUUID().toString())
                .authorId(actorId)
                .authorName(actorName)
                .status(status)
                .note(note)
                .timestamp(LocalDateTime.now())
                .build());
    }

    private void notifyAdmins(String title, String message, String link) {
        for (User admin : userRepository.findByRoleIgnoreCase("ADMIN")) {
            notificationService.createNotification(admin.getId(), title, message, link);
        }
    }

    private void notifyUser(String userId, String title, String message, String link) {
        if (blankToNull(userId) != null) {
            notificationService.createNotification(userId, title, message, link);
        }
    }

    private Integer extractTicketNumber(String ticketCode) {
        if (ticketCode == null) {
            return 0;
        }
        String digits = ticketCode.replaceAll("\\D+", "");
        if (digits.isEmpty()) {
            return 0;
        }
        return Integer.parseInt(digits);
    }

    private String humanizeStatus(String status) {
        return status.toLowerCase().replace('_', ' ');
    }

    private String generateShortToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
    }

    private String requireText(String value, String message) {
        String normalized = blankToNull(value);
        if (normalized == null) {
            throw new RuntimeException(message);
        }
        return normalized;
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String safe(String value) {
        return value == null ? "the assigned team" : value;
    }
}
