package com.mongle.friendservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "socket-service")
public interface SocketServiceClient {

    @PostMapping("/api/socket/disconnect")
    void disconnect(@RequestParam("roomId") String roomId);

}
