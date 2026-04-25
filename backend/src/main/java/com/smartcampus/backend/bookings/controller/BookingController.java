package com.smartcampus.backend.bookings.controller;

import com.smartcampus.backend.bookings.dto.BookingAvailabilityResponse;
import com.smartcampus.backend.bookings.dto.BookingCreateRequest;
import com.smartcampus.backend.bookings.dto.BookingStatusUpdateRequest;
import com.smartcampus.backend.bookings.model.Booking;
import com.smartcampus.backend.bookings.service.BookingService;
import com.smartcampus.backend.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping
    public ApiResponse<List<Booking>> getAllBookings() {
        return ApiResponse.success("All bookings retrieved", bookingService.getAllBookings());
    }

    @GetMapping("/pending")
    public ApiResponse<List<Booking>> getPendingBookings() {
        return ApiResponse.success("Pending bookings retrieved", bookingService.getPendingBookings());
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Booking>> getUserBookings(@PathVariable String userId) {
        return ApiResponse.success("User bookings retrieved", bookingService.getUserBookings(userId));
    }

    @PostMapping("/availability")
    public ApiResponse<BookingAvailabilityResponse> checkAvailability(@RequestBody BookingCreateRequest request) {
        return ApiResponse.success("Availability checked", bookingService.checkAvailability(request));
    }

    @PostMapping
    public ApiResponse<Booking> createBooking(@RequestBody BookingCreateRequest request) {
        return ApiResponse.success("Booking request submitted", bookingService.createBooking(request));
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<Booking> approveBooking(@PathVariable String id) {
        return ApiResponse.success("Booking approved", bookingService.approveBooking(id));
    }

    @PostMapping("/{id}/reject")
    public ApiResponse<Booking> rejectBooking(@PathVariable String id, @RequestBody(required = false) BookingStatusUpdateRequest request) {
        String reason = request == null ? null : request.getReason();
        return ApiResponse.success("Booking rejected", bookingService.rejectBooking(id, reason));
    }

    @PostMapping("/{id}/cancel")
    public ApiResponse<Booking> cancelBooking(@PathVariable String id) {
        return ApiResponse.success("Booking cancelled", bookingService.cancelBooking(id));
    }
}
