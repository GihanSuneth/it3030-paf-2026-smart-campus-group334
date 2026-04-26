package com.smartcampus.backend.resources.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;// The Resource class represents a resource within the smart campus system. It includes fields for resource details such as asset ID, name, code, type, category, location, capacity, status, availability, and various attributes related to the resource. The class is annotated with Lombok annotations for boilerplate code generation and is mapped to a MongoDB collection named "resources". This model serves as the data structure for managing resources such as classrooms, labs, equipment, and facilities within the smart campus environment.

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
    private String stockType;
    private String location;
    private int capacity;
    private String status; // AVAILABLE, MAINTAINANCE, OCCUPIED
    private Boolean available;
    private Integer serviceOrder;
    private String assignedTo;
    private String description;
    private List<String> amenities;
    private String image;
    private Integer totalPcs;
    private Integer workingPcs;
    private Integer smartBoardCount;
    private Integer workingSmartBoards;
    private Integer projectorCount;
    private Integer workingProjectors;
    private Integer screenCount;
    private Integer workingScreens;
    private Integer soundSystemCount;
    private Integer workingSoundSystems;
}
