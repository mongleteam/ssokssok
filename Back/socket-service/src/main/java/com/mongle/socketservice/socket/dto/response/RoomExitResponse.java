package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomExitResponse {
    private String username;
    private String exitMessage;
}
