package com.mongle.userservice.service;


import com.mongle.userservice.entity.User;
import com.mongle.userservice.exception.CustomException;
import com.mongle.userservice.exception.ErroCode;
import com.mongle.userservice.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserMapper userMapper;

    @Override
    public void deleteUser(String userPk){

        int userId = Integer.parseInt(userPk);
        // 1. 유저 존재 여보 확인
        User user = userMapper.getUserInfo(userId);
        if(user == null){
            throw new CustomException(ErroCode.NOT_EXIST_MEMBER_ID);
        }

        // 2. 유저가 존재하면 DB에서 삭제
        userMapper.deleteUser(userId);

    }
}
