package com.smartcampus.backend.bookings.repository;

import com.smartcampus.backend.bookings.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Booking> findByStatusOrderByCreatedAtDesc(String status);
    List<Booking> findByResourceIdAndStatusIn(String resourceId, List<String> statuses);
    List<Booking> findAllByOrderByCreatedAtDesc();
}
