package com.mongle.friendservice.controller;

import com.mongle.friendservice.common.ApiResponseJson;
import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.dto.response.NotificationListResponseDTO;
import com.mongle.friendservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect(@RequestHeader("X-User-Id") String userPk, @RequestHeader(value = "Last-Event-Id", required = false, defaultValue = "") String lastEventId) {
        return ResponseEntity.ok(notificationService.connect(userPk, lastEventId));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponseJson> list(@RequestHeader("X-User-Id") String userPk) {
        List<NotificationListResponseDTO> notifications = notificationService.getNotifications(userPk);

        Map<String, Object> data = new HashMap<>();
        data.put("notifications", notifications);

        return ResponseEntity.ok(new ApiResponseJson(true, 200, "알림함 조회에 성공했습니다.",data));
    }





}
