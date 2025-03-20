package com.mongle.friendservice.controller;

import com.mongle.friendservice.common.ApiResponseJson;
import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/multi")
@RequiredArgsConstructor
public class MultiController {

    private final NotificationService notificationService;

    @PostMapping("/regist")
    public ResponseEntity<ApiResponseJson> sendNotification(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody FriendRequestDTO friendRequestDTO) {


        notificationService.createNotification(userPk, friendRequestDTO.getFriendId(), true);

        return ResponseEntity.ok(new ApiResponseJson(true, 200, "알림이 성공적으로 생성되었습니다.", null));
    }
}
