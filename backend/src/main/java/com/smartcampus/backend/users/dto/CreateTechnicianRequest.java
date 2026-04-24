package com.smartcampus.backend.users.dto;

import lombok.Data;

@Data
public class CreateTechnicianRequest {
    private String name;
    private String email;
    private String password;
    private String department;
}
