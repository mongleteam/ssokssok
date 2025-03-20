package com.mongle.friendservice.controller;

import com.mongle.friendservice.common.ApiResponseJson;
import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friend")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @PostMapping("/regist")
    public ResponseEntity<ApiResponseJson> registerFriend(@RequestHeader("X-User-Id") String UserPk, @RequestBody FriendRequestDTO friendRequestDTO) {
        friendService.createFriendNotification(UserPk, friendRequestDTO);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "친구 요청에 성공했습니다.", null));
    }

    @PostMapping("/accept")
    public ResponseEntity<ApiResponseJson> acceptFriend(@RequestHeader("X-User-Id") String UserPk, @RequestBody FriendRequestDTO friendRequestDTO) {

        return ResponseEntity.ok(new ApiResponseJson());
    }

    @DeleteMapping("/reject")
    public ResponseEntity<ApiResponseJson> rejectFriend(@RequestHeader("X-User-Id") String UserPk, @RequestBody FriendRequestDTO friendRequestDTO) {
        return ResponseEntity.ok(new ApiResponseJson());
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponseJson> getFriendList(@RequestHeader("X-User-Id") String UserPk) {
        return ResponseEntity.ok(new ApiResponseJson());
    }
}
