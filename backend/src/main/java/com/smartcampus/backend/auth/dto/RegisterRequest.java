package com.smartcampus.backend.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String faculty;
    private String regNo;
    private String academicYear;
    private String purpose;
}
