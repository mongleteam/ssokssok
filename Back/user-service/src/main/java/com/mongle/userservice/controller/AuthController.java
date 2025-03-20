package com.mongle.userservice.controller;


import com.mongle.userservice.common.ApiResponseJson;
import com.mongle.userservice.dto.request.LoginRequestDTO;
import com.mongle.userservice.dto.request.RegisterRequestDTO;
import com.mongle.userservice.dto.response.LoginResponseDTO;
import com.mongle.userservice.dto.response.RegisterResponseDTO;
import com.mongle.userservice.security.JwtTokenProvider;
import com.mongle.userservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // final 객체에 자동 autowired
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;


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

    @PostMapping("/logout")
    public ResponseEntity<ApiResponseJson> logout(
            @RequestHeader("X-User-Id") String userPk,
            HttpServletResponse response
    ){
        authService.logout(userPk, response);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "로그아웃에 성공하였습니다", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseJson> refresh(HttpServletRequest request, HttpServletResponse response) {
        LoginResponseDTO responseDTO = authService.refresh(request, response);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "JWT 재발급에 성공했습니다.", responseDTO));
    }
}
