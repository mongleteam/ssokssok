package com.mongle.fairytaleservice.entity;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
public class myalbumdata {
    private int myalbumdataPk;
    private int myalbumPk;
    private String myalbumDataImgUrl;
    private LocalDateTime createDate;
}
