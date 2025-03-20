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
    private Long createDate;

    public Notification(String userPk, String friendId, long createDate) {
        this.userPk = userPk;
        this.friendId = friendId;
        this.createDate = createDate;
    }
}
