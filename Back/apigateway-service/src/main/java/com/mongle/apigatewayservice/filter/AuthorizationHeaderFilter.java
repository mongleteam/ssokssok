package com.mongle.apigatewayservice.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;


import java.nio.charset.StandardCharsets;
import java.util.Set;

@Component
@Slf4j
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {
    private static final SecretKey TOKEN_SECRET = Keys.hmacShaKeyFor("bG9uZ3JhbmRvbXNlY3JldGtleXNlY3VyaXR5Zm9yd2ViYXBwbG9uZ3JhbmRvbXNlY3JldGtleXNlY3VyaXR5Zm9yd2ViYXBwbG9uZ3JhbmRvbXNlY3JldGtleXNlY3VyaXR5Zm9yd2ViYXBw".getBytes(StandardCharsets.UTF_8));


    public AuthorizationHeaderFilter() {
        super(Config.class);
    }

    public static class Config {
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            if (request.getMethod() == HttpMethod.OPTIONS) {
                log.info("Preflight OPTIONS 요청 - 필터 통과");
                return chain.filter(exchange);
            }

            // 🔹 Refresh API 요청은 JWT 검증을 건너뜀
            if (path.equals("/api/auth/refresh")) {
                log.info("Refresh API 요청 - JWT 검증 우회");
                return chain.filter(exchange);
            }


            // 🔹 Authorization 헤더가 없으면 401 반환
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid authorization header", HttpStatus.UNAUTHORIZED);
            }

            String jwt = authorizationHeader.substring(7); // "Bearer " 제거
            String userId = getUserIdFromJwt(jwt);
            if (userId == null) {
                return onError(exchange, "JWT token is not valid", HttpStatus.UNAUTHORIZED);
            }

            log.info("✅ JWT 검증 성공! userId: {}", userId);

            // 🔹 요청 헤더에 userId 추가
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Id", userId)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        log.error(err);

        byte[] bytes = "The requested token is invalid.".getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return response.writeWith(Flux.just(buffer));

    }

    // 🔹 JWT에서 userId(subject) 추출
    private String getUserIdFromJwt(String jwt) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(TOKEN_SECRET)
                    .build()//
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.getSubject();
        } catch (Exception ex) {
            log.error("JWT 검증 실패: " + ex.getMessage());
            return null;
        }
    }
}
