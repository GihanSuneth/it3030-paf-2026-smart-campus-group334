package com.smartcampus.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private UserData user;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserData {
        private String id;
        private String name;
        private String email;
        private String role;
    }
}
