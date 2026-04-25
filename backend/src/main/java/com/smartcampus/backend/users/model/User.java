package com.smartcampus.backend.users.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // USER, ADMIN, TECHNICIAN
    private String department;
    private String faculty;
    
    // Student specific fields
    private String regNo;
    private String academicYear;
    
    // Access Request fields
    private String purpose;
    private boolean isApproved;
}
