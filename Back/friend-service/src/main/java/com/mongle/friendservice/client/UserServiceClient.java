package com.mongle.friendservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/user/nicknameList")
    List<String[]> getNicknameList(@RequestParam("idList") List<String> idList);

    @GetMapping("/api/user/getUUID")
    String getUUID(@RequestParam("id") String id);

    @GetMapping("/api/user/getId")
    String getId(@RequestParam("uuid") String uuid);

}
