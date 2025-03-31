package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomPageRequest {
    private String roomId;
    private int page;
}
