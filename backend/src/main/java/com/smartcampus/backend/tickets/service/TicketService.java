package com.smartcampus.backend.tickets.service;

import com.smartcampus.backend.tickets.model.Ticket;
import com.smartcampus.backend.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

// Service class for managing maintenance tickets. Contains business logic for creating, retrieving, updating, and resolving tickets. The service interacts with the TicketRepository to perform database operations and includes methods for generating unique ticket codes, adding comments to tickets, and handling ticket status updates and technician assignments.
@Service
@RequiredArgsConstructor
public class TicketService {
    // The TicketService class is responsible for managing maintenance tickets in the smart campus system. It provides methods to create new tickets, retrieve existing tickets by various criteria (such as user ID or technician ID), update ticket status, assign technicians to tickets, resolve tickets with resolution notes, and add comments to tickets. The service uses the TicketRepository to interact with the MongoDB database and perform CRUD operations on Ticket entities. Additionally, it includes a method to generate unique ticket codes to ensure that each ticket can be easily identified and tracked within the system.
    private final TicketRepository ticketRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getUserTickets(String userId) {
        return ticketRepository.findByUserId(userId);
    }
// The getTechnicianTickets method retrieves a list of maintenance tickets that are assigned to a specific technician. It takes the technician's ID as a parameter and uses the TicketRepository to query the database for tickets that match the given technician ID. This allows technicians to view and manage the tickets they are responsible for resolving within the smart campus system.
    public List<Ticket> getTechnicianTickets(String technicianId) {
        return ticketRepository.findByTechnicianId(technicianId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
//
    public Ticket createTicket(Ticket ticket) {
        ticket.setTicketCode(generateTicketCode());
        ticket.setStatus("CREATED");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setComments(new ArrayList<>());
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(String id, String status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket assignTechnician(String id, String techId, String techName) {
        Ticket ticket = getTicketById(id);
        ticket.setTechnicianId(techId);
        ticket.setTechnicianName(techName);
        ticket.setStatus("TECHNICIAN_ASSIGNED");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket resolveTicket(String id, String notes) {
        Ticket ticket = getTicketById(id);
        ticket.setResolutionNotes(notes);
        ticket.setStatus("RESOLVED");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
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
        String candidate;
        do {
            int value = ThreadLocalRandom.current().nextInt(16001, 99999);
            candidate = "TKT" + value;
        } while (ticketRepository.existsByTicketCode(candidate));
        return candidate;
    }
}
