package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class RtsRequest {
    private String roomId;
    private String senderName;
    private String rps;
}
