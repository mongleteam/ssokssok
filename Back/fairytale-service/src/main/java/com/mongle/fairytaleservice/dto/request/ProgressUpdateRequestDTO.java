package com.mongle.fairytaleservice.dto.request;


import lombok.*;

@Getter
@Setter
@ToString
public class ProgressUpdateRequestDTO {
    private Integer nowPage;
    private boolean finish;
}
