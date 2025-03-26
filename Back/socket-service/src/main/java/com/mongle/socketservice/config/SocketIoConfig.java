package com.mongle.socketservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.corundumstudio.socketio.SocketIOServer;
// netty 서버 설정
@Configuration
public class SocketIoConfig {

    // 접근 가능한 ip 설정
    @Value("${socketio.server.hostname}")
    private String hostname;

    // netty 서버 port 번호
    @Value("${socketio.server.port}")
    private int port;

    // SocketIOServer Bean 등록
    // Netty 서버를 띄워주는 객체
    @Bean
    public SocketIOServer socketIOServer(){
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        // hostname 설정
        config.setHostname(hostname);
        // port 번호 설정
        config.setPort(port);
        // cors 정책 설정
        config.setOrigin("*");
        return new SocketIOServer(config);
    }
}
