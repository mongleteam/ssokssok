package com.mongle.friendservice.entity;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class Notification {
    private Integer notificationPk;
    private String userPk;
    private String friendId;
    private LocalDateTime createDate;
}
