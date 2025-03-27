package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomObjectCountResponse {
    private String senderName;
    private int objectCount;
}
