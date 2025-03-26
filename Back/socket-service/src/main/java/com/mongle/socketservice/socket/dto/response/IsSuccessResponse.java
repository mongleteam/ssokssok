package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IsSuccessResponse {
    private String senderName;
    private String isSuccess;
}
