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

    // Get all tickets in the system. This endpoint is typically used by administrators to view and manage all maintenance requests across the campus. It returns a list of Ticket objects wrapped in a standardized API response format.
    @GetMapping
    public ApiResponse<List<Ticket>> getAllTickets() {
        return ApiResponse.success("Tickets retrieved successfully", ticketService.getAllTickets());
    }

    // Get all tickets submitted by a specific user. This endpoint allows users to view their own maintenance requests and track their status. It takes the user ID as a path variable and returns a list of Ticket objects associated with that user.
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Ticket>> getUserTickets(@PathVariable String userId) {
        return ApiResponse.success("User tickets retrieved", ticketService.getUserTickets(userId));
    }

    // Get all tickets assigned to a specific technician. This endpoint is used by technicians to view the maintenance requests they are responsible for. It takes the technician ID as a path variable and returns a list of Ticket objects assigned to that technician.
    @GetMapping("/technician/{techId}")
    public ApiResponse<List<Ticket>> getTechnicianTickets(@PathVariable String techId) {
        return ApiResponse.success("Technician tickets retrieved", ticketService.getTechnicianTickets(techId));
    }

    //
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
