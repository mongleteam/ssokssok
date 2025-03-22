package com.mongle.fairytaleservice.controller;


import com.mongle.fairytaleservice.common.ApiResponseJson;
import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.service.FairytaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fairytale")
@RequiredArgsConstructor
public class FairytaleController {

    private final FairytaleService fairytaleService;

    @GetMapping("/{fairytalePk}")
    public ResponseEntity<ApiResponseJson> getFairytaleInfo(@PathVariable Integer fairytalePk) {
        FairytaleInfoResponseDTO responseDTO = fairytaleService.findFairytaleById(fairytalePk);
        return ResponseEntity.ok(new ApiResponseJson(true, 200, "동화책 정보 조회에 성공하였습니다.", responseDTO));
    }
}
