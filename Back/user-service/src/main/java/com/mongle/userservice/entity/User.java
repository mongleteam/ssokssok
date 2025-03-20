package com.mongle.userservice.entity;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class User {
    private String userId;
    private String id;
    private String email;
    private String name;
    private String nickname;
    private String password;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}
