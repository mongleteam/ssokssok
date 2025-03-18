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
}