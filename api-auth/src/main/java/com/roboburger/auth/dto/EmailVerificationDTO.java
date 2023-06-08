package com.roboburger.auth.dto;

import lombok.Data;

@Data
public class EmailVerificationDTO {
    private String email;
    private String phoneNumber;
    private String baseUrl;
    private String userId;
    private String timeZone;
}
