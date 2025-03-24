package com.mongle.userservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public  void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                .allowedOrigins(
                        "http://localhost:5080",
                        "http://127.0.0.1:5080",
                        "http://192.168.30.178:5080",
                        "https://j12e201.p.ssafy.io") // 배포된 프론트 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Set-Cookie") // 쿠키를 클라이언트에서 읽을 수 있도록 허용
                .allowCredentials(true); // 쿠키 허용
    }
}
