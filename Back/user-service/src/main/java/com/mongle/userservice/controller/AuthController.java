package com.mongle.userservice.controller;


import com.mongle.userservice.common.ApiResponseJson;
import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.LoginRequestDTO;
import com.mongle.userservice.dto.request.RegisterRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
import com.mongle.userservice.dto.response.LoginResponseDTO;
import com.mongle.userservice.dto.response.RegisterResponseDTO;
import com.mongle.userservice.security.JwtTokenProvider;
import com.mongle.userservice.service.AuthService;
import com.mongle.userservice.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // final 객체에 자동 autowired
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;


    @PostMapping("/signup")
    public ResponseEntity<ApiResponseJson> signup(@RequestBody RegisterRequestDTO registerRequestDTO) {
        RegisterResponseDTO responseDTO = authService.signup(registerRequestDTO);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "회원가입에 성공하였습니다", responseDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseJson> login(@RequestBody LoginRequestDTO loginRequestDTO, HttpServletResponse response) {
        LoginResponseDTO responseDTO = authService.login(loginRequestDTO, response); // response 전달
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "로그인에 성공하였습니다", responseDTO));
    }

    @PostMapping("/id")
    public ResponseEntity<ApiResponseJson> findId(
            @RequestBody FindIdRequestDTO request
    ){
        FindIdResponseDTO response = authService.findId(request);

        return ResponseEntity.ok(new ApiResponseJson(true, 200, "아이디 찾기에 성공하였습니다.", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseJson> refresh(HttpServletRequest request, HttpServletResponse response) {
        LoginResponseDTO responseDTO = authService.refresh(request, response);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "JWT 재발급에 성공했습니다.", responseDTO));
    }

    @GetMapping("/check-id")
    public ResponseEntity<ApiResponseJson> checkId(
            @RequestParam String id
    ){
        boolean isSuccess = authService.checkId(id);

        if (isSuccess) {
            return ResponseEntity.ok(new ApiResponseJson(false, 200, "이미 존재하는 아이디입니다.", null));
        }else {
            return ResponseEntity.ok(new ApiResponseJson(true, 200, "사용 가능한 아이디입니다.", null));
        }

    }
    @GetMapping("/check-nickname")
    public ResponseEntity<ApiResponseJson> checkNickname(
            @RequestParam String nickname
    ){
        boolean isSuccess = authService.checkNickname(nickname);
        if (isSuccess) {
            return ResponseEntity.ok(new ApiResponseJson(false, 200, "이미 존재하는 닉네임입니다.", null));
        }else {
            return ResponseEntity.ok(new ApiResponseJson(true, 200, "사용 가능한 닉네임입니다.", null));
        }

    }

}
