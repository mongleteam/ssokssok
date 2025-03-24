package com.mongle.fairytaleservice.service;

import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleSimpleDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FairytaleService {
    FairytaleInfoResponseDTO findFairytaleById(Integer fairytalePk, String userPk);
    List<FairytaleSimpleDTO> getAllFairytale();
    String uploadAndSave(MultipartFile file, String userPk, Integer fairytalePk);
}
