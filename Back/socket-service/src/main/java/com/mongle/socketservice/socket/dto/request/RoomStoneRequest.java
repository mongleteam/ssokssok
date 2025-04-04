package com.mongle.socketservice.socket.dto.request;

import com.mongle.socketservice.socket.dto.common.Stone;
import lombok.Data;

import java.util.List;

@Data
public class RoomStoneRequest {
    private String roomId;
    private String senderName;
    private List<Stone> stones;
}
