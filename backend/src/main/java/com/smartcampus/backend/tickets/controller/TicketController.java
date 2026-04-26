package com.smartcampus.backend.tickets.controller;

import com.smartcampus.backend.common.response.ApiResponse;
import com.smartcampus.backend.tickets.model.Ticket;
import com.smartcampus.backend.tickets.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ApiResponse<Ticket> updateStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ApiResponse.success(
                "Ticket status updated",
                ticketService.updateStatus(
                        id,
                        request.get("status"),
                        request.get("note"),
                        request.get("actorId"),
                        request.get("actorName")
                )
        );
    }

    @PostMapping("/{id}/assign")
    public ApiResponse<Ticket> assignTechnician(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ApiResponse.success(
                "Technician assigned to ticket",
                ticketService.assignTechnician(id, request.get("technicianId"), request.get("technicianName"))
        );
    }

    @PostMapping("/{id}/resolve")
    public ApiResponse<Ticket> resolveTicket(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ApiResponse.success(
                "Ticket resolved",
                ticketService.resolveTicket(
                        id,
                        request.get("resolutionNotes"),
                        request.get("configurationDone"),
                        request.get("suggestions"),
                        request.get("actorId"),
                        request.get("actorName")
                )
        );
    }

    @PostMapping("/{id}/accept")
    public ApiResponse<Ticket> acceptResolution(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ApiResponse.success(
                "Ticket closed successfully",
                ticketService.acceptResolution(id, request.get("actorId"), request.get("actorName"))
        );
    }

    @PostMapping("/{id}/rate")
    public ApiResponse<Ticket> submitRating(@PathVariable String id, @RequestBody Map<String, Object> request) {
        Integer rating = request.get("rating") instanceof Number number ? number.intValue() : null;
        return ApiResponse.success(
                "Ticket rating submitted",
                ticketService.submitRating(id, (String) request.get("token"), rating, (String) request.get("feedback"))
        );
    }

    @PostMapping("/{id}/rating-token")
    public ApiResponse<Ticket> generateRatingToken(@PathVariable String id, @RequestBody Map<String, String> request) {
        return ApiResponse.success(
                "Rating token generated",
                ticketService.generateRatingToken(id, request.get("actorId"), request.get("actorName"))
        );
    }

    @PostMapping("/{id}/comments")
    public ApiResponse<Ticket> addComment(@PathVariable String id, @RequestBody Ticket.Comment comment) {
        return ApiResponse.success("Comment added to ticket", ticketService.addComment(id, comment));
    }
}
