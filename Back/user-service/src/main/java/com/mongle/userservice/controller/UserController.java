package com.mongle.userservice.controller;


import com.mongle.userservice.common.ApiResponseJson;
import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
import com.mongle.userservice.dto.request.UpdatePasswordRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
import com.mongle.userservice.dto.response.GetUserInfoResponseDTO;
import com.mongle.userservice.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/user")
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



    @PutMapping("/password")
    public ResponseEntity<ApiResponseJson> updateUserPassword(
            @RequestHeader("X-User-Id") String userPk,
            @RequestBody UpdatePasswordRequestDTO request
    ){
        userService.updateUserPassword(userPk, request);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "비밀번호 변경에 성공하였습니다.", null));
    }

    @GetMapping("")
    public ResponseEntity<ApiResponseJson> getUserInfo(
            @RequestHeader("X-User-Id") String userPk
    ){
      GetUserInfoResponseDTO response = userService.getUserInfo(userPk);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "회원정보 조회에 성공하였습니다.", response));
    }
    @GetMapping("/nicknameList")
    public List<String> getNincknameList(@RequestParam("idList") List<String> idList){
        return userService.getNicknamesByUserId(idList);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseJson> logout(
            @RequestHeader("X-User-Id") String userPk,
            HttpServletResponse response
    ){
        userService.logout(userPk, response);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "로그아웃에 성공하였습니다", null));
    }

    @GetMapping("/getUUID")
    public String getUUID(@RequestParam("id") String id){
        return userService.getUUID(id);
    }

    @GetMapping("/getId")
    public String getId(@RequestParam("uuid") String uuid){
        return userService.getId(uuid);
    }


}
