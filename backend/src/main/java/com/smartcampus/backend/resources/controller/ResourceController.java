package com.smartcampus.backend.resources.controller;

import com.smartcampus.backend.common.response.ApiResponse;
import com.smartcampus.backend.resources.model.Resource;
import com.smartcampus.backend.resources.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/// REST controller for managing resources in the smart campus system. Provides endpoints for creating, retrieving, updating, and deleting resources. The controller delegates business logic to the ResourceService and returns standardized API responses using the ApiResponse wrapper class. Endpoints include:
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {// The ResourceController class is responsible for handling HTTP requests related to resource management in the smart campus system. It provides endpoints for creating new resources, retrieving existing resources by ID or as a list, updating resource details, and deleting resources. The controller uses the ResourceService to perform business logic and interacts with the database through the service layer. Each endpoint returns a standardized API response using the ApiResponse wrapper class to ensure consistent response formatting across the application.
    private final ResourceService resourceService;

    @GetMapping// Get all resources in the system. This endpoint allows users to view a list of all available resources within the smart campus, such as study rooms, equipment, or facilities. It returns a list of Resource objects wrapped in a standardized API response format.
    public ApiResponse<List<Resource>> getAllResources() {
        return ApiResponse.success("Resources retrieved successfully", resourceService.getAllResources());
    }

    @GetMapping("/{id}")// Get a specific resource by its ID. This endpoint allows users to retrieve detailed information about a particular resource by providing its unique identifier. It returns the Resource object corresponding to the given ID wrapped in a standardized API response format.
    public ApiResponse<Resource> getResourceById(@PathVariable String id) {
        return ApiResponse.success("Resource retrieved successfully", resourceService.getResourceById(id));
    }

    @PostMapping
    public ApiResponse<Resource> createResource(@RequestBody Resource resource) {
        return ApiResponse.success("Resource created successfully", resourceService.createResource(resource));
    }

    @PutMapping("/{id}")
    public ApiResponse<Resource> updateResource(@PathVariable String id, @RequestBody Resource resource) {
        return ApiResponse.success("Resource updated successfully", resourceService.updateResource(id, resource));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ApiResponse.success("Resource deleted successfully", null);
    }
}
