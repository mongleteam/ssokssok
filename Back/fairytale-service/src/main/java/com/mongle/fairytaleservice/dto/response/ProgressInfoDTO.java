package com.mongle.fairytaleservice.dto.response;

import lombok.*;

@Data
public class ProgressInfoDTO {
    private Integer progressPk;
    private Integer nowPage;
    private String mode;
    private Boolean finish;
    private String role;
    private String friendNickname;
    private String friendId;
}
