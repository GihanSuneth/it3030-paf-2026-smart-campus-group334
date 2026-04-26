package com.smartcampus.backend.resources.repository;

import com.smartcampus.backend.resources.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;// The ResourceRepository interface extends MongoRepository to provide CRUD operations for Resource entities in the MongoDB database. It includes custom query methods to find resources by type and status, allowing for efficient retrieval of resources based on specific criteria. This repository serves as the data access layer for managing resources in the smart campus system.

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByType(String type);
    List<Resource> findByStatus(String status);
}
