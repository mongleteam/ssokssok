package com.mongle.friendservice.service;

import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.entity.Notification;
import com.mongle.friendservice.exception.CustomException;
import com.mongle.friendservice.exception.ErroCode;
import com.mongle.friendservice.mapper.FriendMapper;
import com.mongle.friendservice.mapper.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private RedisTemplate<String, String> redisTemplate;
    private final FriendMapper friendMapper;
    private final NotificationMapper notificationMapper;
    private final NotificationService notificationService;


    @Override
    public void createFriendNotification(String userPk ,FriendRequestDTO request) {
        // 1. 이미 친구 관계면 에러
        if(friendMapper.countByUserPkAndFriend(userPk, request.getFriendId()) > 0){
            throw new CustomException(ErroCode.DUPLICATE_FRIEND_RELATION);
        }
        // 2. 이미 요청했으면 에러
        if(notificationMapper.countByUserPkAndFriend(userPk, request.getFriendId()) > 0){
            throw new CustomException(ErroCode.DUPLICATE_FRIEND_RELATION);
        }
        Notification notification = new Notification();
        notification.setUserPk(userPk);
        notification.setFriendId(request.getFriendId());
        notification.setCreateDate(System.currentTimeMillis());
        notificationService.createNotification(userPk, request.getFriendId(), false);
    }

    @Override
    public void deleteFriendNotification(String userPk, FriendRequestDTO request) {
        try{
            notificationMapper.deleteByUserPkAndFriendId(userPk, request.getFriendId());
        } catch (Exception e) {
            throw new RuntimeException("친구 요청 알림 삭제 실패: " + e.getMessage());
        }
    }


}
