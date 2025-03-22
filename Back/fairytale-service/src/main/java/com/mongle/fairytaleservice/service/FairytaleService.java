package com.mongle.fairytaleservice.service;

import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;

public interface FairytaleService {
    FairytaleInfoResponseDTO findFairytaleById(Integer fairytalePk);
}
