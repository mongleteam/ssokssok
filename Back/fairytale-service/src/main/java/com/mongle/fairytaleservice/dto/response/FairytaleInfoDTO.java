package com.mongle.fairytaleservice.dto.response;

import lombok.*;

@Data
public class FairytaleInfoDTO {
    private Integer fairytalePk;
    private String title;
    private Integer count;
    private String coverImgUrl;
    private String first;
    private String second;
    private String metadata;
}
