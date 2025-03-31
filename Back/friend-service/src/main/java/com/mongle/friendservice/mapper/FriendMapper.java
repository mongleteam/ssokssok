package com.mongle.friendservice.mapper;

import com.mongle.friendservice.dto.response.FriendListResponseDTO;
import com.mongle.friendservice.entity.Friend;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FriendMapper {
    int countByUserPkAndFriend(@Param("userPk") String userPk, @Param("friendId") String friendId);

    List<Friend> getList(@Param("userPk") String userPk);

    void insert(@Param("userPk") String userPk,@Param("friendId") String friendId);

    int delete(@Param("userPk") String userPk,@Param("friendId")String friendId);

    void deleteAll(@Param("userPk") String userPk, @Param("userId") String userId);
}
