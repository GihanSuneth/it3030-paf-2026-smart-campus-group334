package com.smartcampus.backend.tickets.controller;

import com.smartcampus.backend.common.response.ApiResponse;
import com.smartcampus.backend.tickets.model.Ticket;
import com.smartcampus.backend.tickets.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/// REST controller for managing maintenance tickets. Provides endpoints for creating, retrieving, updating, and resolving tickets. The controller delegates business logic to the TicketService and returns standardized API responses using the ApiResponse wrapper class. Endpoints include:
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {
    private final TicketService ticketService;

    @GetMapping
    public ApiResponse<List<Ticket>> getAllTickets() {
        return ApiResponse.success("Tickets retrieved successfully", ticketService.getAllTickets());
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Ticket>> getUserTickets(@PathVariable String userId) {
        return ApiResponse.success("User tickets retrieved", ticketService.getUserTickets(userId));
    }

    @GetMapping("/technician/{techId}")
    public ApiResponse<List<Ticket>> getTechnicianTickets(@PathVariable String techId) {
        return ApiResponse.success("Technician tickets retrieved", ticketService.getTechnicianTickets(techId));
    }

    @GetMapping("/{id}")
    public ApiResponse<Ticket> getTicketById(@PathVariable String id) {
        return ApiResponse.success("Ticket details retrieved", ticketService.getTicketById(id));
    }

    @PostMapping
    public ApiResponse<Ticket> createTicket(@RequestBody Ticket ticket) {
        return ApiResponse.success("Ticket created successfully", ticketService.createTicket(ticket));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Ticket> updateStatus(@PathVariable String id, @RequestParam String status) {
        return ApiResponse.success("Ticket status updated", ticketService.updateStatus(id, status));
    }

    @PostMapping("/{id}/assign")
    public ApiResponse<Ticket> assignTechnician(@PathVariable String id, @RequestParam String techId, @RequestParam String techName) {
        return ApiResponse.success("Technician assigned to ticket", ticketService.assignTechnician(id, techId, techName));
    }

    @PostMapping("/{id}/resolve")
    public ApiResponse<Ticket> resolveTicket(@PathVariable String id, @RequestBody String notes) {
        return ApiResponse.success("Ticket resolved", ticketService.resolveTicket(id, notes));
    }

    @PostMapping("/{id}/comments")
    public ApiResponse<Ticket> addComment(@PathVariable String id, @RequestBody Ticket.Comment comment) {
        return ApiResponse.success("Comment added to ticket", ticketService.addComment(id, comment));
    }
}
