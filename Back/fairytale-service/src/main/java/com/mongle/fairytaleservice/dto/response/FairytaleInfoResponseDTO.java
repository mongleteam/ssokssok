package com.mongle.fairytaleservice.dto.response;

import lombok.*;

import java.util.List;

@Data
public class FairytaleInfoResponseDTO {
    private FairytaleInfoDTO fairytale;
    private List<ProgressInfoDTO> progressList;
}


