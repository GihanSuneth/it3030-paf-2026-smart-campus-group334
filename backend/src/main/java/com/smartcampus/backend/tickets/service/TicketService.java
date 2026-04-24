package com.smartcampus.backend.tickets.service;

import com.smartcampus.backend.tickets.model.Ticket;
import com.smartcampus.backend.tickets.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getUserTickets(String userId) {
        return ticketRepository.findByUserId(userId);
    }

    public List<Ticket> getTechnicianTickets(String technicianId) {
        return ticketRepository.findByTechnicianId(technicianId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket createTicket(Ticket ticket) {
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
}
