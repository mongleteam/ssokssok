package com.mongle.fairytaleservice.entity;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class myalbum {
    private int myalbumPk;
    private String userPk;
    private Integer fairytalePk;
    private String myalbumDataImgUrl;
    private LocalDateTime createdDate;
}
