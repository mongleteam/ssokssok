package com.mongle.fairytaleservice.entity;

import lombok.*;

@NoArgsConstructor
@Data
public class fairytale {
    private int fairytaleId;
    private String title;
    private int count;
    private String coverImgUrl;
    private String first;
    private String second;
    private String metaData;
}
