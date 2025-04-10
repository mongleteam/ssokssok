package com.mongle.friendservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MultiRejectDTO {
    private String friendId;
    private String roomId;
}
