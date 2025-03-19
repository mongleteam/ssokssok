package com.mongle.userservice.dto.request;

import lombok.*;
import java.time.LocalDateTime;
import com.mongle.userservice.entity.User;

@Data
public class RegisterRequestDTO {
    private String id;
    private String name;
    private String email;
    private String nickname;
    private String password;

    public User toUserEntity(String encodedPassword) {
        return User.builder()
                .id(this.id)
                .name(this.name)
                .nickname(this.nickname)
                .email(this.email)
                .password(encodedPassword)  // 암호화된 비밀번호를 파라미터로 전달
                .createDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .build();
    }
}
