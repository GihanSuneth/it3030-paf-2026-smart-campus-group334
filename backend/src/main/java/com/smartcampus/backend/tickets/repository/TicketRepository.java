package com.smartcampus.backend.tickets.repository;

import com.smartcampus.backend.tickets.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// The TicketRepository interface extends MongoRepository to provide CRUD operations for Ticket entities in the MongoDB database. It includes custom query methods to find tickets by user ID, technician ID, status, and to check for the existence of a ticket by its unique ticket code. This repository serves as the data access layer for managing maintenance tickets in the smart campus system.
@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByTechnicianId(String technicianId);
    List<Ticket> findByStatus(String status);
    boolean existsByTicketCode(String ticketCode);
}
