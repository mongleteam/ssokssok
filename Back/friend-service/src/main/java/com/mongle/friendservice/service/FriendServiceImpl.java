package com.mongle.friendservice.service;

import com.mongle.friendservice.client.UserServiceClient;
import com.mongle.friendservice.dto.request.FriendRequestDTO;
import com.mongle.friendservice.dto.response.FriendListResponseDTO;
import com.mongle.friendservice.entity.Friend;
import com.mongle.friendservice.entity.Notification;
import com.mongle.friendservice.exception.CustomException;
import com.mongle.friendservice.exception.ErroCode;
import com.mongle.friendservice.mapper.FriendMapper;
import com.mongle.friendservice.mapper.NotificationMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {
    private RedisTemplate<String, String> redisTemplate;
    private final FriendMapper friendMapper;
    private final NotificationMapper notificationMapper;
    private final NotificationService notificationService;
    private final UserServiceClient userServiceClient;


    @Override
    public void createFriendNotification(String userPk ,FriendRequestDTO request) {
        String friendPk = userServiceClient.getUUID(request.getFriendId());
        String userId = userServiceClient.getId(userPk);
        // 1. 이미 친구 관계면 에러
        if(friendMapper.countByUserPkAndFriend(userPk, request.getFriendId()) > 0){
            throw new CustomException(ErroCode.DUPLICATE_FRIEND_RELATION);
        }
        // 2. 이미 요청했으면 에러
        if(notificationMapper.countByUserPkAndFriend(friendPk, userId) > 0){
            throw new CustomException(ErroCode.DUPLICATE_FRIEND_RELATION);
        }
        Notification notification = new Notification();
        notification.setUserPk(userPk);
        notification.setFriendId(request.getFriendId());
        notificationService.createNotification(userPk, request.getFriendId(), false);
    }

    @Override
    public void deleteFriendNotification(String userPk, FriendRequestDTO request) {
        try{
            int cnt = notificationMapper.deleteByUserPkAndFriendId(userPk, request.getFriendId());
            if(cnt == 0){
                throw new CustomException(ErroCode.INVALID_REQUEST);
            }
        } catch (Exception e) {
            throw new RuntimeException("친구 요청 알림 삭제 실패: " + e.getMessage());
        }
    }

    @Override
    public List<FriendListResponseDTO> getFriendList(String userPk) {
        try{
            List<Friend> list = friendMapper.getList(userPk);
            List<String> requestList = new ArrayList<>();
            List<String> result = new ArrayList<>();
            for(Friend friend : list){
                requestList.add(friend.getFriendId());
            }
            result = userServiceClient.getNicknameList(requestList);
            List<FriendListResponseDTO> friendListResponseDTOList = new ArrayList<>();
            for (int i = 0; i < list.size(); i++) {
                Friend friend = list.get(i);
                String nickname = result.get(i);

                // 작업 수행
                FriendListResponseDTO friendListResponseDTO = new FriendListResponseDTO(friend.getFriendId(), nickname);
                friendListResponseDTOList.add(friendListResponseDTO);
            }

            return friendListResponseDTOList;
        } catch (Exception e) {
            throw new RuntimeException("친구 목록 조회 실패: " + e.getMessage());
        }

    }

    @Override
    public void createFriendRelation(String userPk, FriendRequestDTO friendRequestDTO) {
        try{
            friendMapper.insert(userPk, friendRequestDTO.getFriendId());
            String friendPk = userServiceClient.getUUID(friendRequestDTO.getFriendId());
            String userId = userServiceClient.getId(userPk);
            friendMapper.insert(friendPk, userId);

            notificationService.sendNotification(friendPk);
        }catch (Exception e){
            throw new RuntimeException("친구 요청 수락 실패: " + e.getMessage());
        }
    }

    @Override
    public void deleteFriend(String userPk, FriendRequestDTO friendRequestDTO) {
        int cnt = friendMapper.delete(userPk, friendRequestDTO.getFriendId());
        if(cnt == 0){
            throw new CustomException(ErroCode.DELETE_FAIL);
        }
        String friendPk = userServiceClient.getUUID(friendRequestDTO.getFriendId());
        String userId = userServiceClient.getId(userPk);
        friendMapper.delete(friendPk, userId);

    }


}
