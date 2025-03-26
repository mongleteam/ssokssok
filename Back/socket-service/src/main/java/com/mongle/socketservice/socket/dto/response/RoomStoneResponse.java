package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomStoneResponse {
    private String senderName;
    private int stoneCount;
}
