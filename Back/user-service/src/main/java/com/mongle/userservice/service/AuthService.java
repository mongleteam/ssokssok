package com.mongle.userservice.service;

import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
import com.mongle.userservice.dto.response.LoginResponseDTO;
import com.mongle.userservice.dto.response.RegisterResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.mongle.userservice.dto.request.LoginRequestDTO;
import com.mongle.userservice.dto.request.RegisterRequestDTO;

public interface AuthService {
    RegisterResponseDTO signup(RegisterRequestDTO request);
    FindIdResponseDTO findId(FindIdRequestDTO request);
    LoginResponseDTO login(LoginRequestDTO request,HttpServletResponse response);
    LoginResponseDTO refresh(HttpServletRequest request, HttpServletResponse response);
    boolean checkId(String id);
    boolean checkNickname(String nickname);
    boolean checkEmail(String email);
}