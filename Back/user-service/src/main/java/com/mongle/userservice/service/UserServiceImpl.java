package com.mongle.userservice.service;


import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
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

    public void updateUserName(String userPk, UpdateNameRequestDTO request){
        // 1. 빈칸을 입력할 경우 에러 처리
        if (request.getNewName() == null || request.getNewName().trim().isEmpty()) {
            throw new CustomException(ErroCode.INVALID_INPUT);
        }

        int userId = Integer.parseInt(userPk);

        userMapper.updateUserName(userId, request.getNewName());
    }

    public void updateUserNickName(String userPk, UpdateNickNameRequestDTO request){
        // 1. 빈칸을 입력할 경우 에러 처리
        if (request.getNewNickName() == null || request.getNewNickName().trim().isEmpty()) {
            throw new CustomException(ErroCode.INVALID_INPUT);
        }

        int userId = Integer.parseInt(userPk);

        userMapper.updateUserNickName(userId, request.getNewNickName());
    }
}
