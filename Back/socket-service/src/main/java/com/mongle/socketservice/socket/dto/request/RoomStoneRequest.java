package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RoomStoneRequest {
    private String senderName;
    private String roomId;
    private int stoneCount;
}
