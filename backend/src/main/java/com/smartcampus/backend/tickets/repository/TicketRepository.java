package com.smartcampus.backend.tickets.repository;

import com.smartcampus.backend.tickets.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByTechnicianId(String technicianId);
    List<Ticket> findByStatus(String status);
    boolean existsByTicketCode(String ticketCode);
}
