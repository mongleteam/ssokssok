package com.mongle.socketservice.socket.dto.request;

import lombok.Data;

@Data
public class IsSuccessRequest {
    private String senderName;
    private String roomId;
    private String isSuccess;
}
