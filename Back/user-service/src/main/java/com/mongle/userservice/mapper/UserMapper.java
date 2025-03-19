package com.mongle.userservice.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.mongle.userservice.entity.User;

@Mapper
public interface UserMapper {
    void signup(User user);

    int countById(@Param("id") String id);

    int countByEmail(@Param("email") String email);

    int countByNickname(@Param("nickname") String nickname);

    User findById(@Param("id") String id);

    User getUserInfo(@Param("userId") int userId);

    void deleteUser(@Param("userId") int userId);

    void updateUserName(@Param("userId") int userId, @Param("newName") String newName);

    void updateUserNickName(@Param("userId") int userId, @Param("newNickName") String newNickName);

    String findIdByEmail(@Param("email") String email);


}