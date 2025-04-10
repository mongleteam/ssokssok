package com.mongle.socketservice.controller;

import com.mongle.socketservice.socket.SocketEventHandler;
import com.mongle.socketservice.socket.dto.request.RoomDisconnectionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/socket")
public class SocketController {

    private final SocketEventHandler socketEventHandler;

    @PostMapping("/disconnet")
    public void disconnet(@RequestBody String roomId) {
        RoomDisconnectionRequest roomDisconnectionRequest = new RoomDisconnectionRequest();
        roomDisconnectionRequest.setRoomId(roomId);
        socketEventHandler.disconnectRoomFromRest(roomDisconnectionRequest);
    }
}
