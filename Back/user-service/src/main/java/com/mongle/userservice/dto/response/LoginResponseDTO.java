package com.mongle.userservice.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
}

