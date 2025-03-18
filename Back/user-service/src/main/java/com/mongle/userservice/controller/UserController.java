package com.mongle.userservice.controller;


import com.mongle.userservice.common.ApiResponseJson;
import com.mongle.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
