package com.mongle.socketservice.socket.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stone {
    private int id;
    private double x;
    private double y;
    private String owner;
}
