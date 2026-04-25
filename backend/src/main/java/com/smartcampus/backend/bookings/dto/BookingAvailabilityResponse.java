package com.smartcampus.backend.bookings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAvailabilityResponse {
    private boolean available;
    private String message;
    private String conflictDetails;
    private List<BookingAlternativeResponse> suggestedResources;
}
