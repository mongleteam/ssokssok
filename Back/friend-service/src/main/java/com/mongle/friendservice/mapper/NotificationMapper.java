package com.mongle.friendservice.mapper;

import com.mongle.friendservice.dto.response.NotificationListResponseDTO;
import com.mongle.friendservice.entity.Notification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NotificationMapper {
    int countByUserPkAndFriend(@Param("userPk") String userPk, @Param("friendId") String friendId);
    int insert(Notification notification);

    int deleteByUserPkAndFriendId(@Param("userPk") String userPk, @Param("friendId") String friendId);

    List<NotificationListResponseDTO> findNotificationsByUserId(@Param("userPk") String userPk);
}
