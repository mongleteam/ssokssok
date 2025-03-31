package com.mongle.friendservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationListResponseDTO {
    String state;
    String friendId;
    private Long timestamp;
    String roomId;

    public static NotificationListResponseDTO fromMySQL(String friendId, Long timestamp, String roomId) {
        return new NotificationListResponseDTO("friend", friendId, timestamp, roomId);
    }
    public static NotificationListResponseDTO fromRedis(String friendId, Long timestamp, String roomId) {
        return new NotificationListResponseDTO("multi", friendId, timestamp, roomId);
    }
}
