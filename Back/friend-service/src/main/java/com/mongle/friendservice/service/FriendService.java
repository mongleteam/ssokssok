package com.mongle.friendservice.service;

import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.dto.response.FriendListResponseDTO;

import java.util.List;

public interface FriendService {
    void createFriendNotification(String userPk, FriendRequestDTO friendRequestDTO);

    void deleteFriendNotification(String userPk, FriendRequestDTO friendRequestDTO);

    List<FriendListResponseDTO> getFriendList(String userPk);

    void createFriendRelation(String userPk, FriendRequestDTO friendRequestDTO);

    void deleteFriend(String userPk, FriendRequestDTO friendRequestDTO);
}
