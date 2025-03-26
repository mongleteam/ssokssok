package com.mongle.friendservice.controller;

import com.mongle.friendservice.common.ApiResponseJson;
import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.dto.response.RoomIdResponseDTO;
import com.mongle.friendservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/multi")
@RequiredArgsConstructor
public class MultiController {

    private final NotificationService notificationService;

    @PostMapping("/regist")
    public ResponseEntity<ApiResponseJson> sendNotification(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody FriendRequestDTO friendRequestDTO) {
        String roomId = notificationService.createNotification(userPk, friendRequestDTO.getFriendId(), true);
        RoomIdResponseDTO roomIdResponseDTO = new RoomIdResponseDTO(roomId);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "알림이 성공적으로 생성되었습니다.", roomIdResponseDTO));
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponseJson> acceptNotification(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody FriendRequestDTO friendRequestDTO
    ){
        notificationService.deleteMultiNotification(userPk, friendRequestDTO);

        return ResponseEntity.ok(new ApiResponseJson(true, 200, "멀티 요청 수락에 성공했습니다.", true));
    }

    @PostMapping("/reject")
    public ResponseEntity<ApiResponseJson> rejectNotification(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody FriendRequestDTO friendRequestDTO
    ){
        notificationService.deleteMultiNotification(userPk, friendRequestDTO);

        return ResponseEntity.ok(new ApiResponseJson(true, 200, "멀티 요청 거절에 성공했습니다.", false));
    }
}
