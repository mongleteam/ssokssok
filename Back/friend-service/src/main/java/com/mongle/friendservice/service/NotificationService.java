package com.mongle.friendservice.service;

import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.dto.response.NotificationListResponseDTO;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface NotificationService {
    SseEmitter connect(String userPk, String lastEventId);

    List<NotificationListResponseDTO> getNotifications(String userPk);

    String createNotification(String userPk, String friendId, boolean isMulti);

    void sendNotification(String userPk);

    void deleteMultiNotification(String userPk, FriendRequestDTO friendRequestDTO);

}
