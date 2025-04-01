package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDrawResponse {
    private String senderName;
    private double x;
    private double y;
}
