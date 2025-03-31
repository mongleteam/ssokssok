package com.mongle.fairytaleservice.dto.request;

import lombok.*;
import com.mongle.fairytaleservice.dto.Mode;

@Getter
@Setter
@ToString
public class ProgressInsertRequestDTO {
    private Mode mode;
    private String friendId;
    private Integer fairytalePk;
    private Integer nowPage;
    private String userPk;
    private String role;
}
