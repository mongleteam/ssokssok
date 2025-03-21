package com.mongle.userservice.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.mongle.userservice.entity.User;

import java.util.List;

@Mapper
public interface UserMapper {
    void signup(User user);

    int countById(@Param("id") String id);

    int countByEmail(@Param("email") String email);

    int countByNickname(@Param("nickname") String nickname);

    User findById(@Param("id") String id);

    User getUserInfo(@Param("userId") String userId);

    void deleteUser(@Param("userId") String userId);

    void updateUserName(@Param("userId") String userId, @Param("newName") String newName);

    void updateUserNickName(@Param("userId") String userId, @Param("newNickName") String newNickName);

    String findIdByEmail(@Param("email") String email);

    String getPasswordByUserId(@Param("userId") String userId);

    void updateUserPassword(@Param("userId") String userId, @Param("newPassword") String newPassword);

    List<String> findNicknamesByUserId(@Param("idList") List<String> idList);



}