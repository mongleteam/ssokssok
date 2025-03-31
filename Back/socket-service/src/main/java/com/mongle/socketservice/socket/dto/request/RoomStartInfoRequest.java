package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomStartInfoRequest {
    private String roomId;
    private String inviteRole;
    private String inviteeRole;
    private int pageIndex;
}
