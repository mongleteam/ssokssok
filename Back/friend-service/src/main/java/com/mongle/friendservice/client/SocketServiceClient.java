package com.mongle.friendservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;


@FeignClient(name = "socket-service")
public interface SocketServiceClient {

    @PostMapping("/api/socket/disconnect")
    public void disconnect(String roomId);

}
