package com.smartcampus.backend.bookings.dto;

import lombok.Data;

@Data
public class BookingCreateRequest {
    private String userId;
    private String userName;
    private String bookingType;
    private String resourceId;
    private String date;
    private String startTime;
    private String endTime;
    private String purpose;
    private int expectedAttendance;
}
