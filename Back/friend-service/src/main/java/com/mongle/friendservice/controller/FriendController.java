package com.mongle.friendservice.controller;

import com.mongle.friendservice.common.ApiResponseJson;
import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.dto.response.FriendListResponseDTO;
import com.mongle.friendservice.service.FriendService;
import com.mongle.friendservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friend")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/regist")
    public ResponseEntity<ApiResponseJson> registerFriend(@RequestHeader("X-User-Id") String userPk, @RequestBody FriendRequestDTO friendRequestDTO) {
        friendService.createFriendNotification(userPk, friendRequestDTO);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "친구 요청에 성공했습니다.", null));
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponseJson> acceptFriend(@RequestHeader("X-User-Id") String userPk, @RequestBody FriendRequestDTO friendRequestDTO) {
        friendService.createFriendRelation(userPk, friendRequestDTO);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "친구 요청 수락에 성공했습니다.", null));
    }

    @DeleteMapping("/reject")
    public ResponseEntity<ApiResponseJson> rejectFriend(@RequestHeader("X-User-Id") String userPk, @RequestBody FriendRequestDTO friendRequestDTO) {
        friendService.deleteFriendNotification(userPk, friendRequestDTO);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "친구 요청 거절에 성공했습니다.", null));
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponseJson> getFriendList(@RequestHeader("X-User-Id") String userPk) {
        List<FriendListResponseDTO> list = friendService.getFriendList(userPk);
        Map<String, Object> data = new HashMap<>();
        data.put("friendList", list);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "친구 목록 조회에 성공했습니다.", data));
    }
}
