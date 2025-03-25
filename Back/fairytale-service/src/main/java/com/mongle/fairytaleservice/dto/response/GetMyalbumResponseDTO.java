package com.mongle.fairytaleservice.dto.response;

import lombok.Data;

@Data
public class GetMyalbumResponseDTO {
    private Integer myalbumPk;
    private String myalbumImgUrl;
    private String createdDate;
    private String title;
}
