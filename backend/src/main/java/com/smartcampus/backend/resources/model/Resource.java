package com.smartcampus.backend.resources.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;
    private String assetId;
    private String name;
    private String code;
    private String type; // CLASSROOM, LAB, EQUIPMENT
    private String category;
    private String location;
    private int capacity;
    private String status; // AVAILABLE, MAINTAINANCE, OCCUPIED
    private Boolean available;
    private Integer serviceOrder;
    private String assignedTo;
    private String description;
    private List<String> amenities;
    private String image;
}
