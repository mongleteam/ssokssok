package com.mongle.fairytaleservice.service;

import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleSimpleDTO;

import java.util.List;

public interface FairytaleService {
    FairytaleInfoResponseDTO findFairytaleById(Integer fairytalePk, String userPk);
    List<FairytaleSimpleDTO> getAllFairytale();
}
