package com.mongle.friendservice.service;

import com.mongle.friendservice.dto.request.FriendRequestDTO;

public interface FriendService {
    void createFriendNotification(String userPk, FriendRequestDTO friendRequestDTO);

    void deleteFriendNotification(String userPk, FriendRequestDTO friendRequestDTO);
}
