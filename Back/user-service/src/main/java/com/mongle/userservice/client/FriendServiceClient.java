package com.mongle.userservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "friend-service")
public interface FriendServiceClient {
    @DeleteMapping("/api/friend/delete-friends")
    void deleteFriend(@RequestParam("userPk") String userPk,@RequestParam("userId") String userId);
}
