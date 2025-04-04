package com.mongle.socketservice.socket.dto.response;

import com.mongle.socketservice.socket.dto.common.Stone;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RoomStoneResponse {
    private String senderName;
    private List<Stone> stones;
}
