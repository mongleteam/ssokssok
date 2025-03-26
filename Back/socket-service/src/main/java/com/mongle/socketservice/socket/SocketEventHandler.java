package com.mongle.socketservice.socket;
import com.corundumstudio.socketio.BroadcastOperations;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.mongle.socketservice.socket.dto.request.*;
import com.mongle.socketservice.socket.dto.response.IsSuccessResponse;
import com.mongle.socketservice.socket.dto.response.RoomStoneResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
// cicd test
@Component
@RequiredArgsConstructor
@Slf4j
public class SocketEventHandler {
    private final SocketIOServer server;

    @PostConstruct
    public void init(){
        // 소켓 연결을 확인해줌
        server.addConnectListener(client ->{
            log.info("연결된 세션 : {}", client.getSessionId());
        });

        // 누가 접속 해제했는지 확인 해줌
        server.addDisconnectListener(client -> {
            log.info("❌ 연결 해제됨 - 세션 ID: {}", client.getSessionId());
        });

        // 방에 들어가는 event
        server.addEventListener("joinRoom", RoomJoinRequest.class, (client, data, ack) -> joinRoom(client, data));

        // 방을 나가는 event
        server.addEventListener("leaveRoom", RoomLeaveRequest.class, (client, data, ack) -> leaveRoom(client, data));

        // roomId에 해당하는 모든 socket 연결 해제
        server.addEventListener("disconnectRoom", RoomDisconnectionRequest.class, (client, data, ack) -> disconnectRoom(data));

        // 본인 성공 여부 전송
        server.addEventListener("isSuccess", IsSuccessRequest.class, (client, data, ack) -> isSuccess(data));

        // 본인 페이지 전송
        server.addEventListener("pageCount", RoomPageRequest.class, (client, data, ack)-> pageCount(data));

        // 본인 돌개수 전송
        server.addEventListener("objectCount", RoomObjectCountRequest.class,(client, data, ack) -> objectCount(data));
    }

    // 자기가 성공했는지 room에 있는 사람한테 전달한다.
    private void isSuccess(IsSuccessRequest data){
        String roomId = data.getRoomId();
        String message = data.getIsSuccess();
        IsSuccessResponse isSuccessResponse = new IsSuccessResponse(data.getSenderName(), message);

        server.getRoomOperations(roomId).sendEvent("isSuccess", isSuccessResponse);
    }

    // 본인 페이지 전송
    private void pageCount(RoomPageRequest data){
        String roomId = data.getRoomId();
        int page = data.getPage();

        server.getRoomOperations(roomId).sendEvent("pageCount",page);
    }

    // 숫자를 상대방 한테 보냅니다.
    private void objectCount(RoomObjectCountRequest data){
        String roomId = data.getRoomId();
        int stoneCount = data.getObjectCount();
        String name = data.getSenderName();

        RoomStoneResponse roomStoneResponse = new RoomStoneResponse(name, stoneCount);
        server.getRoomOperations(roomId).sendEvent("objectCount", roomStoneResponse);
    }

    // join broad casting group
    private void joinRoom(SocketIOClient client, RoomJoinRequest data){
        String roomId = data.getRoomId();
        client.joinRoom(roomId);
        log.info("roomID : " + roomId);
    }

    // exit broad casting group
    private void leaveRoom(SocketIOClient client, RoomLeaveRequest data){
        String roomId = data.getRoomId();

        client.leaveRoom(roomId);
        client.disconnect();
    }

    // 거절 시 로직
    private void disconnectRoom(RoomDisconnectionRequest data){
        String roomId = data.getRoomId();
        // 해당 roomId의 정보를 가져온다.
        BroadcastOperations room = server.getRoomOperations(roomId);

        // roomId에 해당하는 room에 있는 socket 연결을 모두 끊어버린다.
        for(SocketIOClient client : room.getClients())
            client.disconnect();
    }
}
