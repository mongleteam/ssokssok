package com.mongle.fairytaleservice.controller;


import com.mongle.fairytaleservice.common.ApiResponseJson;
import com.mongle.fairytaleservice.dto.response.GetMyalbumResponseDTO;
import com.mongle.fairytaleservice.service.MyalbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/myalbum")
@RequiredArgsConstructor
public class MyalbumController {

    private final MyalbumService myalbumService;
    @GetMapping("")
    public ResponseEntity<ApiResponseJson> getMyAlbumList(
            @RequestHeader("X-User-Id") String userPk
    ){
        List<GetMyalbumResponseDTO> result = myalbumService.getMyalbumList(userPk);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "마이앨범 조회에 성공하였습니다.", result));
    }


}
