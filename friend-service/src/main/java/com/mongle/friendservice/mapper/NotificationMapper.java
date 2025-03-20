package com.mongle.friendservice.mapper;

import com.mongle.friendservice.entity.Notification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface NotificationMapper {
    int countByUserPkAndFriend(@Param("userPk") String userPk, @Param("friendId") String friendId);
    int insert(Notification notification);
}
