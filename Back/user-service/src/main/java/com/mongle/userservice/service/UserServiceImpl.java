package com.mongle.userservice.service;


import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
import com.mongle.userservice.dto.request.UpdatePasswordRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
import com.mongle.userservice.dto.response.GetUserInfoResponseDTO;
import com.mongle.userservice.entity.User;
import com.mongle.userservice.exception.CustomException;
import com.mongle.userservice.exception.ErroCode;
import com.mongle.userservice.mapper.UserMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final RedisTemplate<String, String> redisTemplate;
    private final AuthService authService;
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
    public void logout(String userPk, HttpServletResponse response) {
        // 1. Redis에서 Refresh Token 삭제
        redisTemplate.delete("RT:" + userPk);

        // 2. 클라이언트의 Refresh Token 쿠키 삭제
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // 쿠키 즉시 만료
        response.addCookie(refreshTokenCookie);

    }

    @Override
    public void updateUserNickName(String userPk, UpdateNickNameRequestDTO request){
        // 1. 빈칸을 입력할 경우 에러 처리
        if (request.getNewNickName() == null || request.getNewNickName().trim().isEmpty()) {
            throw new CustomException(ErroCode.INVALID_INPUT);
        }

        boolean isSuccess = authService.checkNickname(request.getNewNickName());
        if (isSuccess) {
            throw new CustomException(ErroCode.DUPLICATE_MEMBER_NICKNAME);
        }else {
            userMapper.updateUserNickName(userPk, request.getNewNickName());
        }
    }



    @Override
    public void updateUserPassword(String userPk, UpdatePasswordRequestDTO request) {
        // 1. 빈칸 입력시 예외 처리
        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()
        || request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            throw new CustomException(ErroCode.INVALID_INPUT);
        }

        // 2. 현재 비밀번호 가져오기
        String currentPassword = userMapper.getPasswordByUserId(userPk);

        // 3. 입력된 비밀번호랑 현재 비밀번호 비교
        if (!bCryptPasswordEncoder.matches(request.getCurrentPassword(), currentPassword)) {
            throw new CustomException(ErroCode.INCORRECT_MEMBER_PASSWORD);
        }

        // 4. 새 비밀번호 암호화 후 업데이트
        String encryptedPassword = bCryptPasswordEncoder.encode(request.getNewPassword());
        userMapper.updateUserPassword(userPk, encryptedPassword);

    }

    @Override
    public GetUserInfoResponseDTO getUserInfo(String userPk) {

        User user = userMapper.getUserInfo(userPk);

        if (user == null) {
            throw new CustomException(ErroCode.NOT_EXIST_MEMBER_ID);
        }
        // 3. DTO로 변환하여 반환
        return new GetUserInfoResponseDTO(user.getId(), user.getName(), user.getNickname(), user.getEmail());
    }

    @Override
    public List<String> getNicknamesByUserId(List<String> idList) {
        return userMapper.findNicknamesByUserId(idList);
    }

    @Override
    public String getUUID(String id) {
        return userMapper.getUUID(id);
    }

    @Override
    public String getId(String uuid) {
        return userMapper.getId(uuid);
    }

    @Override
    public List<String> getIdList(String id) {
        return userMapper.getIdList(id);
    }


}
