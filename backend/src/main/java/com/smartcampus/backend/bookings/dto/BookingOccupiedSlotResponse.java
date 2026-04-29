package com.smartcampus.backend.bookings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingOccupiedSlotResponse {
    private String bookingId;
    private String bookingCode;
    private String date;
    private String startTime;
    private String endTime;
    private String status;
    private String resourceName;
    private String purpose;
}
