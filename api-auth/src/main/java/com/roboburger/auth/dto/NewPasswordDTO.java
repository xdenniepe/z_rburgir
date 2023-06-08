package com.roboburger.auth.dto;

import lombok.Data;

@Data
public class NewPasswordDTO {
    private String code;
    private String newPassword;
}
