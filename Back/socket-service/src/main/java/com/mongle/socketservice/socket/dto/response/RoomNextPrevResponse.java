package com.mongle.socketservice.socket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomNextPrevResponse {
    private Boolean next;
    private Boolean prev;
}
