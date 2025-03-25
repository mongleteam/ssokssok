package com.mongle.userservice.dto.request;

import lombok.*;

@Data
public class UpdatePasswordRequestDTO {
    private String currentPassword;
    private String newPassword;
}
