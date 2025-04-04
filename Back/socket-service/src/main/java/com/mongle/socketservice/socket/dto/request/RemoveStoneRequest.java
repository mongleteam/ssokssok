package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RemoveStoneRequest {
    private String roomId;
    private String senderName;
    private int stoneId;
}
