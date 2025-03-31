package com.mongle.fairytaleservice.controller;


import com.mongle.fairytaleservice.common.ApiResponseJson;
import com.mongle.fairytaleservice.dto.request.DeleteMyAlbumRequestDTO;
import com.mongle.fairytaleservice.dto.response.GetMyalbumResponseDTO;
import com.mongle.fairytaleservice.service.MyalbumService;
import jakarta.ws.rs.DELETE;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("")
    public ResponseEntity<ApiResponseJson> deleteMyAlbums(
            @RequestHeader("X-User-Id") String userPK,
            @RequestBody DeleteMyAlbumRequestDTO requestDTO
    ){
        myalbumService.deleteMyalbum(requestDTO.getMyalbumPks(), userPK);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "마이앨범 삭제에 성공하였습니다.", null));
    }


}
