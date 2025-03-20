package com.mongle.friendservice.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FriendMapper {
    int countByUserPkAndFriend(@Param("userPk") String userPk, @Param("friendId") String friendId);
}
