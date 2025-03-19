package com.mongle.userservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey key;

    @Value("${jwt.access-token-validity-in-seconds}")
    private long accessTokenValidityInSeconds;

    @Value("${jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;

    /**
     * 생성자에서 JWT 서명에 사용할 키를 초기화합니다.
     * @param secretKey application.yml에서 설정한 JWT 비밀키
     */
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * HTTP 요청 헤더에서 Bearer 토큰을 추출합니다.
     * @param request HTTP 요청
     * @return 추출된 JWT 토큰 (Bearer 제거)
     */
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null) {
            log.info("🔍 Authorization 헤더 값: '{}'", bearerToken.trim()); // 공백 제거 후 확인
        }
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return null;
    }

    /**
     * JWT 토큰에서 사용자 인증 정보를 생성합니다.
     * @param token JWT 토큰
     * @return Spring Security의 Authentication 객체
     */
    public Authentication getAuthentication(String token) {
        String userId = extractSubject(token);
        UserDetails userDetails = new User(userId, "", new ArrayList<>());
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    /**
     * 액세스 토큰을 생성합니다.
     * @param subject 토큰에 담을 사용자 식별자
     * @return 생성된 JWT 액세스 토큰
     */
    public String createAccessToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenValidityInSeconds * 1000);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 리프레시 토큰을 생성합니다.
     * @param subject 토큰에 담을 사용자 식별자
     * @return 생성된 JWT 리프레시 토큰
     */
    public String createRefreshToken(String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenValidityInSeconds * 1000);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * JWT 토큰의 유효성을 검증합니다.
     * @param token 검증할 JWT 토큰
     * @return 토큰 유효성 여부
     */
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .setAllowedClockSkewSeconds(60) // 60초 허용
                    .build()
                    .parseClaimsJws(token);

            Date expiration = claims.getBody().getExpiration();
            log.info("JWT 토큰이 유효합니다. 만료 시간: {}", expiration);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("JWT 토큰이 만료되었습니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰 형식입니다: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("잘못된 JWT 토큰입니다: {}", e.getMessage());
        } catch (SignatureException e) {
            log.error("JWT 서명이 유효하지 않습니다: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 비어있습니다: {}", e.getMessage());
        }
        return false;
    }


    /**
     * JWT 토큰에서 subject(사용자 식별자)를 추출합니다.
     * @param token JWT 토큰
     * @return 추출된 사용자 식별자
     */
    public String extractSubject(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            log.error("토큰에서 subject 추출 실패: {}", e.getMessage());
            return null;
        }
    }
    public long getRefreshTokenValidityInMillis() {
        return refreshTokenValidityInSeconds * 1000;
    }
}