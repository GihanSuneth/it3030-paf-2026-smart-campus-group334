package com.smartcampus.backend.auth.dto;

import lombok.Data;

@Data
public class OAuthLoginRequest {
    private String provider;
    private String accessToken;
    private String role;
}
