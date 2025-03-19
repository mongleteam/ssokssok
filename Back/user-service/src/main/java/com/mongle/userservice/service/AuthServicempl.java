package com.mongle.userservice.service;


import com.mongle.userservice.dto.request.LoginRequestDTO;
import com.mongle.userservice.dto.request.RegisterRequestDTO;
import com.mongle.userservice.dto.response.LoginResponseDTO;
import com.mongle.userservice.dto.response.RegisterResponseDTO;
import com.mongle.userservice.entity.User;
import com.mongle.userservice.exception.CustomException;
import com.mongle.userservice.exception.ErroCode;
import com.mongle.userservice.mapper.UserMapper;
import com.mongle.userservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import java.util.concurrent.TimeUnit;

@Service
// 롬복을 활용한 생성자 주입
@RequiredArgsConstructor
public class AuthServicempl implements AuthService {
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;


    @Override
    public RegisterResponseDTO signup(RegisterRequestDTO request) {
        if (userMapper.countById(request.getId()) > 0) {
            throw new CustomException(ErroCode.DUPLICATE_MEMBER_ID);
        }
        if (userMapper.countByEmail(request.getEmail()) > 0) {
            throw new CustomException(ErroCode.DUPLICATE_MEMBER_EMAIL);
        }
        if (userMapper.countByNickname(request.getNickname()) > 0) {
            throw new CustomException(ErroCode.DUPLICATE_MEMBER_NICKNAME);
        }
        // DTO의 변환 메서드를 호출하여 User 엔티티 생성
        User user = request.toUserEntity(passwordEncoder.encode(request.getPassword()));
        try{
            userMapper.signup(user);
        }catch (Exception e) {
            throw new RuntimeException("회원가입 실패: " + e.getMessage());
        }

        return new RegisterResponseDTO(user.getId(), user.getName(), user.getNickname(), user.getEmail());
    }
    @Override
    public LoginResponseDTO login(LoginRequestDTO request, HttpServletResponse response) {
        // 1. 사용자 조회 (아이디로)
        User user = userMapper.findById(request.getId());
        if (user == null) {
            throw new CustomException(ErroCode.NOT_EXIST_MEMBER_ID);
        }
        // 2. 비밀번호가 유효한지 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErroCode.INCORRECT_MEMBER_PASSWORD);
        }
        // 3. JwtTokenProiver에 있는 토큰 생성하는 함수를 이용해서 access,refresh 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(String.valueOf(user.getUserId()));
        String refreshToken = jwtTokenProvider.createRefreshToken(String.valueOf(user.getUserId()));

        // 4. Redis에 Refresh Token 저장
        // 키 형식: "RT:{userId}" / 만료 시간은 Refresh Token 만료 시간과 동일하게 설정(TTL 설정)
        redisTemplate.opsForValue().set(
                "RT:" + user.getUserId(),
                refreshToken,
                jwtTokenProvider.getRefreshTokenValidityInMillis(),
                TimeUnit.MILLISECONDS
        );

        // 5. 쿠키에 Refresh Token 저장
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) jwtTokenProvider.getRefreshTokenValidityInMillis() / 1000);
        response.addCookie(refreshTokenCookie);

        // 6. LoginResponseDTO 반환
        return new LoginResponseDTO(accessToken, refreshToken);
    }

    @Override
    public void logout(String userPk, HttpServletResponse response) {
        // 1. Redis에서 Refresh Token 삭제
        redisTemplate.delete("RT:" + userPk);

        // 2. 클라이언트의 Refresh Token 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // 쿠키 즉시 만료
        response.addCookie(refreshTokenCookie);

    }

}
