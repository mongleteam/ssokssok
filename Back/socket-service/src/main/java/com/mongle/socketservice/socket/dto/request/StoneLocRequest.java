package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class StoneLocRequest {
    private String roomId;
    private String senderName;
    private double x;
    private double y;
}
