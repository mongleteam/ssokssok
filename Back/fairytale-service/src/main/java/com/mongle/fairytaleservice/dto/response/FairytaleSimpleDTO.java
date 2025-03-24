package com.mongle.fairytaleservice.dto.response;

import lombok.*;

@Data
@Builder
public class FairytaleSimpleDTO {
    private Integer fairytalePk;
    private String title;
    private Integer count;
    private String coverImgUrl;
}

