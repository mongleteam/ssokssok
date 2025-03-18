package com.mongle.userservice.service;

import com.mongle.userservice.dto.response.LoginResponseDTO;
import com.mongle.userservice.dto.response.RegisterResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.mongle.userservice.dto.request.LoginRequestDTO;
import com.mongle.userservice.dto.request.RegisterRequestDTO;

public interface AuthService {
    RegisterResponseDTO signup(RegisterRequestDTO request);
    LoginResponseDTO login(LoginRequestDTO request,HttpServletResponse response);
}
