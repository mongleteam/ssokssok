package com.mongle.fairytaleservice.service;


import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.exception.CustomException;
import com.mongle.fairytaleservice.exception.ErrorCode;
import com.mongle.fairytaleservice.mapper.FairytaleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FairytaleServiceImpl implements FairytaleService {
    private final FairytaleMapper fairytaleMapper;

    @Override
    public FairytaleInfoResponseDTO findFairytaleById(Integer fairytalePk, String userPk) {
        // 1. 동화책 정보 가져오기
        var fairytale = fairytaleMapper.findFairytaleById(fairytalePk);
        if (fairytale == null) {
            throw new CustomException(ErrorCode.UNKNOWN_FAIRYTALE);
        }

        // 2. 진행상황 리스트 가져오기
        var progressList = fairytaleMapper.findProgressListByFairytaleAndUser(fairytalePk, userPk);

        // 3. 응답 DTO 조립
        var response = new FairytaleInfoResponseDTO();
        response.setFairytale(fairytale);
        response.setProgressList(progressList);

        return response;
    }
}
