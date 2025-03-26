package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomLeaveRequest {
    private String roomId;
    private String username;
}
