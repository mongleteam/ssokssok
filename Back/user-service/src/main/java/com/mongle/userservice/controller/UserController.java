package com.mongle.userservice.controller;


import com.mongle.userservice.common.ApiResponseJson;
import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
import com.mongle.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @DeleteMapping("")
    public ResponseEntity<ApiResponseJson> deleteUser(
        @RequestHeader("X-User-Id") String userPk
    ){
        userService.deleteUser(userPk);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "회원탈퇴에 성공하였습니다.", null));
    }

    @PutMapping("/name")
    public ResponseEntity<ApiResponseJson> updateUserName(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody UpdateNameRequestDTO request
    ){
        userService.updateUserName(userPk, request);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "이름이 변경되었습니다.", null));
    }
    @PutMapping("/nickname")
    public ResponseEntity<ApiResponseJson> updateUserNickName(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody UpdateNickNameRequestDTO request
    ){
        userService.updateUserNickName(userPk, request);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "닉네임이 변경되었습니다.", null));
    }

    @PostMapping("/id")
    public ResponseEntity<ApiResponseJson> findId(
            @RequestBody FindIdRequestDTO request
    ){
        FindIdResponseDTO response = userService.findId(request);

        return ResponseEntity.ok(new ApiResponseJson(true, 200, "아이디 찾기에 성공하였습니다.", response));
    }
}
