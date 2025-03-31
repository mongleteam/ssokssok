package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomInviteeResponse {
    private String senderName;
    private Boolean isJoin;
}
