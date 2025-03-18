package com.mongle.userservice.controller;


import com.mongle.userservice.common.ApiResponseJson;
import com.mongle.userservice.dto.request.LoginRequestDTO;
import com.mongle.userservice.dto.request.RegisterRequestDTO;
import com.mongle.userservice.dto.response.LoginResponseDTO;
import com.mongle.userservice.dto.response.RegisterResponseDTO;
import com.mongle.userservice.security.JwtTokenProvider;
import com.mongle.userservice.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
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
}
