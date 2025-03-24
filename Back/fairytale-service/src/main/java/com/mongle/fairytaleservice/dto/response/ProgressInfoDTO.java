package com.mongle.fairytaleservice.dto.response;

import lombok.*;

@Data
public class ProgressInfoDTO {
    private Integer progressPk;
    private Integer nowPage;
    private String mode;
    private String finish;
    private String role;
    private String friendNickname; // user 테이블에서 가져온 값
}
