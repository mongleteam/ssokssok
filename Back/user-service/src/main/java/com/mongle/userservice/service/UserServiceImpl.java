package com.mongle.userservice.service;


import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
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


        // 1. 유저 존재 여보 확인
        User user = userMapper.getUserInfo(userPk);
        if(user == null){
            throw new CustomException(ErroCode.NOT_EXIST_MEMBER_ID);
        }

        // 2. 유저가 존재하면 DB에서 삭제
        userMapper.deleteUser(userPk);

    }

    @Override
    public void updateUserName(String userPk, UpdateNameRequestDTO request){
        // 1. 빈칸을 입력할 경우 에러 처리
        if (request.getNewName() == null || request.getNewName().trim().isEmpty()) {
            throw new CustomException(ErroCode.INVALID_INPUT);
        }



        userMapper.updateUserName(userPk, request.getNewName());
    }

    @Override
    public void updateUserNickName(String userPk, UpdateNickNameRequestDTO request){
        // 1. 빈칸을 입력할 경우 에러 처리
        if (request.getNewNickName() == null || request.getNewNickName().trim().isEmpty()) {
            throw new CustomException(ErroCode.INVALID_INPUT);
        }


        userMapper.updateUserNickName(userPk, request.getNewNickName());
    }

    @Override
    public FindIdResponseDTO findId(FindIdRequestDTO request) {
        // 1.이메일 추출
        String email = request.getEmail();

        // 2. 이메일을 이용하여 아이디 조회 (UserMapper.findIdByEmail가 String 반환)
        String foundUserId = userMapper.findIdByEmail(email);
        if (foundUserId == null) {
            throw new CustomException(ErroCode.NOT_EXIST_MEMBER_EMAIL);
        }
        // 3. FindIdResponseDTO 생성하여 반환
        return new FindIdResponseDTO(foundUserId);
    }


}
