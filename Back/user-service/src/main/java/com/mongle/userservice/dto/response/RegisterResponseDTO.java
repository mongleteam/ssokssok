package com.mongle.userservice.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
public class RegisterResponseDTO {
    private String id;
    private String name;
    private String nickname;
    private String email;
}
