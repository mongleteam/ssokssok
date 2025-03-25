package com.mongle.fairytaleservice.entity;

import lombok.*;

@Getter
@Setter
public class progress {
    private Integer progressPk;
    private Integer nowPage;
    private String mode;
    private String friendId;
    private String userPk;
    private Integer fairytalePk;
    private Boolean finish;
    private String role;
}
