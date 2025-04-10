package com.mongle.socketservice.socket;
import com.corundumstudio.socketio.BroadcastOperations;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.mongle.socketservice.socket.dto.request.*;
import com.mongle.socketservice.socket.dto.response.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
// cicd test12345
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

        // 게임에서 나갈 시 알리는 이벤트
        server.addEventListener("leaveGame", RoomExitRequest.class, (client, data, ack) -> leaveGame(client, data));

        //수락자가 입장했음을 초대자에게 알림
        server.addEventListener("inviteeJoined", RoomInviteeRequest.class, (client, data, ack) -> inviteeJoined(data));

        // 초대자가 초대받는 사람에게 역할을 부여합니다.
        server.addEventListener("sendStartInfo", RoomStartInfoRequest.class, (client, data, ack) -> sendStartInfo(data));

        server.addEventListener("prevNext", RoomNextPrevRequest.class, (client, data, ack) ->
                prevNext(data));

        // 본인이 제거한 돌의 위치를 보냅니다.
//        server.addEventListener("removeStone", StoneLocRequest.class, (client, data, ack) ->
//                removeStone(data));

        server.addEventListener("draw", RoomDrawRequest.class, (client, data, ack) -> draw(data));

        server.addEventListener("initStones", RoomStoneRequest.class, (client, data, ack) -> initStones(data));

        server.addEventListener("removeStone", RemoveStoneRequest.class, (client, data, ack) ->
                removeStone(data));

        server.addEventListener("sendRts", RtsRequest.class, (client, data, ack) ->
                sendRts(data));
    }

    // 본인이 가위바위보에서 뭐 냈는지
    private void sendRts(RtsRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("sendRts", new RtsResponse(data.getSenderName(), data.getRps()));
    }

    // 돌의 위치를 초기화 합니다.
    private void initStones(RoomStoneRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("initStones", new RoomStoneResponse(data.getSenderName(), data.getStones()));
    }

    // 돌을 제거합니다.
    private void removeStone(RemoveStoneRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("removeStone", new RemoveStoneResponse(data.getSenderName(), data.getStoneId()));
    }


    // frame 단위로 점 하나를 추가할 수 있습니다.
    // frame 때 그림에 좌표하나가 추가 한다면 상대방에게 알립니다.
    private void draw(RoomDrawRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("draw", new RoomDrawResponse(data.getSenderName(),data.getX(), data.getY()));
    }

    // 본인이 제거한 돌의 위치를 보냅니다.
//    private void removeStone(StoneLocRequest data){
//        String roomId = data.getRoomId();
//        server.getRoomOperations(roomId).sendEvent("removeStone", new StoneLocResponse(data.getSenderName(), data.getX(), data.getY()));
//    }

    // 왼쪽인지 오른쪽인지
    private void prevNext(RoomNextPrevRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("prevNext", new RoomNextPrevResponse(data.getNext(), data.getPrev()));
    }

    // 초대자가 초대받는 사람에게 역할을 부여합니다.
    private void sendStartInfo(RoomStartInfoRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("sendStartInfo", new RoomStartInfoResponse(data.getInviteRole(), data.getInviteeRole(), data.getPageIndex()));
    }
    //수락자가 입장했음을 초대자에게 알림
    private void inviteeJoined(RoomInviteeRequest data){
        String roomId = data.getRoomId();
        server.getRoomOperations(roomId).sendEvent("inviteeJoined", new RoomInviteeResponse(data.getSenderName(), data.getIsJoin()));

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
        RoomPageResponse roomPageResponse = new RoomPageResponse(data.getPage());

        server.getRoomOperations(roomId).sendEvent("pageCount",roomPageResponse);
    }

    // 숫자를 상대방 한테 보냅니다.
    private void objectCount(RoomObjectCountRequest data){
        String roomId = data.getRoomId();
        int stoneCount = data.getObjectCount();
        String name = data.getSenderName();

        RoomObjectCountResponse roomStoneResponse = new RoomObjectCountResponse(name, stoneCount);
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

    // 자신이 나갔을 때 상대방에게 알려줍니다.
    private void leaveGame(SocketIOClient client, RoomExitRequest data){
        String roomId = data.getRoomId();
        RoomExitResponse response = new RoomExitResponse(data.getUsername(), "상대방이 나갔습니다.");

        server.getRoomOperations(roomId).sendEvent("leaveGame", response);

        client.leaveRoom(roomId);
        client.disconnect();
    }

    public void disconnectRoomFromRest(RoomDisconnectionRequest data) {
        disconnectRoom(data);
    }

}
