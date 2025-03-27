package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomExitRequest {
    private String roomId;
    private String username;
}
