package com.mongle.friendservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendListResponseDTO {
    private String friendId;
    private String friendNickname;
}
