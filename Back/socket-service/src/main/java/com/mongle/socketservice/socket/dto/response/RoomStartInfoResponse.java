package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomStartInfoResponse {
    private String inviteRole;
    private String inviteeRole;
    private int pageIndex;
}
