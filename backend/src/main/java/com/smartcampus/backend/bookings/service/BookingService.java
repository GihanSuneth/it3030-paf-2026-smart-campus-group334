package com.smartcampus.backend.bookings.service;

import com.smartcampus.backend.bookings.dto.BookingAlternativeResponse;
import com.smartcampus.backend.bookings.dto.BookingAvailabilityResponse;
import com.smartcampus.backend.bookings.dto.BookingCreateRequest;
import com.smartcampus.backend.bookings.model.Booking;
import com.smartcampus.backend.bookings.repository.BookingRepository;
import com.smartcampus.backend.notifications.service.NotificationService;
import com.smartcampus.backend.resources.model.Resource;
import com.smartcampus.backend.resources.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private static final List<String> BLOCKING_STATUSES = List.of("PENDING", "APPROVED");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatusOrderByCreatedAtDesc("PENDING");
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public BookingAvailabilityResponse checkAvailability(BookingCreateRequest request) {
        Resource resource = getActiveResource(request.getResourceId());
        LocalDateTime startDateTime = parseDateTime(request.getDate(), request.getStartTime());
        LocalDateTime endDateTime = parseDateTime(request.getDate(), request.getEndTime());
        validateBookingWindow(startDateTime, endDateTime);

        if (resource.getCapacity() > 0 && request.getExpectedAttendance() > resource.getCapacity()) {
            return BookingAvailabilityResponse.builder()
                    .available(false)
                    .message("Expected attendance exceeds the selected resource capacity.")
                    .suggestedResources(findSuggestedResources(resource, request.getBookingType(), request.getExpectedAttendance(), startDateTime, endDateTime))
                    .build();
        }

        boolean available = isResourceAvailable(resource.getId(), startDateTime, endDateTime);
        if (available) {
            return BookingAvailabilityResponse.builder()
                    .available(true)
                    .message("The selected slot is available and ready for admin review.")
                    .suggestedResources(List.of())
                    .build();
        }

        return BookingAvailabilityResponse.builder()
                .available(false)
                .message("This resource is already booked or awaiting review for the selected time.")
                .suggestedResources(findSuggestedResources(resource, request.getBookingType(), request.getExpectedAttendance(), startDateTime, endDateTime))
                .build();
    }

    public Booking createBooking(BookingCreateRequest request) {
        BookingAvailabilityResponse availability = checkAvailability(request);
        if (!availability.isAvailable()) {
            throw new RuntimeException(availability.getMessage());
        }

        Resource resource = getActiveResource(request.getResourceId());
        LocalDateTime startDateTime = parseDateTime(request.getDate(), request.getStartTime());
        LocalDateTime endDateTime = parseDateTime(request.getDate(), request.getEndTime());
        LocalDateTime now = LocalDateTime.now();

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .bookingType(request.getBookingType())
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .resourceCode(resource.getCode())
                .resourceType(resource.getType())
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .startDateTime(startDateTime)
                .endDateTime(endDateTime)
                .purpose(request.getPurpose())
                .expectedAttendance(request.getExpectedAttendance())
                .status("PENDING")
                .createdAt(now)
                .updatedAt(now)
                .build();

        return bookingRepository.save(booking);
    }

    public Booking approveBooking(String id) {
        Booking booking = getBooking(id);
        booking.setStatus("APPROVED");
        booking.setReviewComment("Approved by admin.");
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        notificationService.createNotification(
                booking.getUserId(),
                "Booking approved",
                booking.getResourceName() + " has been approved for " + booking.getDate() + " at " + booking.getStartTime() + ".",
                "/my-bookings"
        );
        return saved;
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = getBooking(id);
        booking.setStatus("REJECTED");
        booking.setReviewComment(reason == null || reason.isBlank() ? "Booking rejected by admin." : reason);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking saved = bookingRepository.save(booking);
        notificationService.createNotification(
                booking.getUserId(),
                "Booking rejected",
                booking.getResourceName() + " was rejected. " + booking.getReviewComment(),
                "/my-bookings"
        );
        return saved;
    }

    public Booking cancelBooking(String id) {
        Booking booking = getBooking(id);
        booking.setStatus("CANCELLED");
        booking.setReviewComment("Booking cancelled by user.");
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    private Booking getBooking(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private Resource getActiveResource(String resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (!"ACTIVE".equalsIgnoreCase(resource.getStatus())) {
            throw new RuntimeException("Selected resource is not available for booking.");
        }

        return resource;
    }

    private void validateBookingWindow(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (!endDateTime.isAfter(startDateTime)) {
            throw new RuntimeException("End time must be after start time.");
        }
    }

    private LocalDateTime parseDateTime(String date, String time) {
        return LocalDateTime.parse(date + "T" + time, DATE_TIME_FORMATTER);
    }

    private boolean isResourceAvailable(String resourceId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndStatusIn(resourceId, BLOCKING_STATUSES);
        return existingBookings.stream().noneMatch(booking ->
                startDateTime.isBefore(booking.getEndDateTime()) && booking.getStartDateTime().isBefore(endDateTime)
        );
    }

    private List<BookingAlternativeResponse> findSuggestedResources(
            Resource selectedResource,
            String bookingType,
            int expectedAttendance,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    ) {
        return resourceRepository.findByStatus("ACTIVE").stream()
                .filter(resource -> !resource.getId().equals(selectedResource.getId()))
                .filter(resource -> resource.getCategory() != null && resource.getCategory().equalsIgnoreCase(bookingType))
                .filter(resource -> resource.getCapacity() <= 0 || resource.getCapacity() >= expectedAttendance)
                .filter(resource -> isResourceAvailable(resource.getId(), startDateTime, endDateTime))
                .sorted(Comparator.comparing(Resource::getCapacity))
                .limit(3)
                .map(resource -> BookingAlternativeResponse.builder()
                        .resourceId(resource.getId())
                        .resourceName(resource.getName())
                        .resourceCode(resource.getCode())
                        .resourceType(resource.getType())
                        .category(resource.getCategory())
                        .location(resource.getLocation())
                        .capacity(resource.getCapacity())
                        .build())
                .toList();
    }
}
