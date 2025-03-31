package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomInviteeRequest {
    private String senderName;
    private String roomId;
    private Boolean isJoin;
}
