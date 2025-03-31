package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomNextPrevRequest {
    private String roomId;
    private Boolean next;
    private Boolean prev;
}
