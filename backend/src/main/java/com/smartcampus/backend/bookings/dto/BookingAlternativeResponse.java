package com.smartcampus.backend.bookings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAlternativeResponse {
    private String resourceId;
    private String resourceName;
    private String resourceCode;
    private String resourceType;
    private String category;
    private String location;
    private int capacity;
}
