package com.mongle.socketservice.config;

import com.corundumstudio.socketio.SocketIOServer;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Component;

@Component
// Bean 생성임 Spring Boot에서 알아서 탐지 해서 Spring Context에 넣어줌
// Bean과의 차이점은 Bean은 수동으로 등록해줘야 함 그래서 외부라이브러리에 있는 객체를 싱글톤으로 생성할 때 쓰임
public class SocketIOStarter {
    private final SocketIOServer server;

    public SocketIOStarter(SocketIOServer server){
        this.server = server;
    }

    // netty 서버 생성
    @PostConstruct // Bean 이 생성될 때 초기화 함수
    public void start(){
        server.start();
    }

    // netty 서버 닫음
    @PreDestroy // spring context가 닫힐 때 실행 되는 함수
    public void stop(){
        server.stop();
    }

}
