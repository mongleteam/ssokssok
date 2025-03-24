package com.mongle.friendservice.entity;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class Friend {
    private Integer friendPk;
    private String userPk;
    private String friendId;
}
