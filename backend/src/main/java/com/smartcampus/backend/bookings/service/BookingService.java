package com.smartcampus.backend.bookings.service;

import com.smartcampus.backend.bookings.dto.BookingAlternativeResponse;
import com.smartcampus.backend.bookings.dto.BookingAvailabilityResponse;
import com.smartcampus.backend.bookings.dto.BookingCreateRequest;
import com.smartcampus.backend.bookings.model.Booking;
import com.smartcampus.backend.bookings.repository.BookingRepository;
import com.smartcampus.backend.notifications.service.NotificationService;
import com.smartcampus.backend.resources.model.Resource;
import com.smartcampus.backend.resources.repository.ResourceRepository;
import com.smartcampus.backend.users.model.User;
import com.smartcampus.backend.users.repository.UserRepository;
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
    private final UserRepository userRepository;

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
        validateBookingRequest(request);
        Resource resource = getActiveResource(request.getResourceId());
        LocalDateTime startDateTime = parseDateTime(request.getDate(), request.getStartTime());
        LocalDateTime endDateTime = parseDateTime(request.getDate(), request.getEndTime());
        validateBookingWindow(startDateTime, endDateTime);

        if (resource.getCapacity() > 0 && request.getExpectedAttendance() > resource.getCapacity()) {
            return BookingAvailabilityResponse.builder()
                    .available(false)
                    .message("Expected attendance exceeds the selected resource capacity.")
                    .conflictDetails("Requested attendance: " + request.getExpectedAttendance() + ", capacity: " + resource.getCapacity() + ".")
                    .suggestedResources(findSuggestedResources(resource, request.getBookingType(), request.getExpectedAttendance(), startDateTime, endDateTime))
                    .build();
        }

        Booking conflictingBooking = findConflictingBooking(resource.getId(), startDateTime, endDateTime);
        if (conflictingBooking == null) {
            return BookingAvailabilityResponse.builder()
                    .available(true)
                    .message("No conflicts found. You can proceed with the booking request.")
                    .conflictDetails("")
                    .suggestedResources(List.of())
                    .build();
        }

        return BookingAvailabilityResponse.builder()
                .available(false)
                .message("This resource is already booked or awaiting review for the selected time.")
                .conflictDetails("Conflict: " + conflictingBooking.getDate() + " from " + conflictingBooking.getStartTime() + " to " + conflictingBooking.getEndTime() + " (" + conflictingBooking.getStatus() + ").")
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
                .bookingCode(generateBookingCode())
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

        Booking savedBooking = bookingRepository.save(booking);
        notifyAdminsAboutPendingBooking(savedBooking);
        return savedBooking;
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
        if (resourceId == null || resourceId.isBlank()) {
            throw new RuntimeException("Select a resource or equipment before checking availability.");
        }

        return resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    private void validateBookingRequest(BookingCreateRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new RuntimeException("Booking user is required.");
        }

        if (request.getUserName() == null || request.getUserName().isBlank()) {
            throw new RuntimeException("Booking user name is required.");
        }

        if (request.getBookingType() == null || request.getBookingType().isBlank()) {
            throw new RuntimeException("Booking type is required.");
        }

        if (request.getResourceId() == null || request.getResourceId().isBlank()) {
            throw new RuntimeException("Resource or equipment is required.");
        }

        if (request.getDate() == null || request.getDate().isBlank()) {
            throw new RuntimeException("Booking date is required.");
        }

        if (request.getStartTime() == null || request.getStartTime().isBlank()) {
            throw new RuntimeException("Start time is required.");
        }

        if (request.getEndTime() == null || request.getEndTime().isBlank()) {
            throw new RuntimeException("End time is required.");
        }

        if (request.getPurpose() == null || request.getPurpose().isBlank()) {
            throw new RuntimeException("Booking purpose is required.");
        }

        if (request.getExpectedAttendance() <= 0) {
            throw new RuntimeException("Expected attendees must be greater than zero.");
        }
    }

    private void validateBookingWindow(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("You cannot book a resource or equipment for a past date or time.");
        }

        if (!endDateTime.isAfter(startDateTime)) {
            throw new RuntimeException("End time must be after start time.");
        }
    }

    private LocalDateTime parseDateTime(String date, String time) {
        return LocalDateTime.parse(date + "T" + time, DATE_TIME_FORMATTER);
    }

    private boolean isResourceAvailable(String resourceId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return findConflictingBooking(resourceId, startDateTime, endDateTime) == null;
    }

    private Booking findConflictingBooking(String resourceId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndStatusIn(resourceId, BLOCKING_STATUSES);
        return existingBookings.stream().filter(booking ->
                startDateTime.isBefore(booking.getEndDateTime()) && booking.getStartDateTime().isBefore(endDateTime)
        ).min(Comparator.comparing(Booking::getStartDateTime)).orElse(null);
    }

    private List<BookingAlternativeResponse> findSuggestedResources(
            Resource selectedResource,
            String bookingType,
            int expectedAttendance,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime
    ) {
        return resourceRepository.findAll().stream()
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

    private void notifyAdminsAboutPendingBooking(Booking booking) {
        for (User admin : userRepository.findByRoleIgnoreCase("ADMIN")) {
            notificationService.createNotification(
                    admin.getId(),
                    "New booking request",
                    booking.getBookingCode() + " - " + booking.getUserName() + " requested " + booking.getResourceName() + " for " + booking.getDate() + " at " + booking.getStartTime() + ".",
                    "/admin/bookings/pending"
            );
        }
    }

    private String generateBookingCode() {
        return bookingRepository.findAllByOrderByBookingCodeDesc().stream()
                .map(Booking::getBookingCode)
                .filter(code -> code != null && code.startsWith("BK"))
                .findFirst()
                .map(code -> {
                    int next = Integer.parseInt(code.substring(2)) + 1;
                    return "BK" + next;
                })
                .orElse("BK1001");
    }
}
