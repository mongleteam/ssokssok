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
    public FairytaleInfoResponseDTO findFairytaleById(Integer fairytalePk) {
        FairytaleInfoResponseDTO result = fairytaleMapper.findFairytaleById(fairytalePk);
        if (result == null) {
            throw new CustomException(ErrorCode.UNKNOWN_FAIRYTALE);
        }
        return result;
    }
}
