package com.mongle.userservice.service;

import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
import com.mongle.userservice.dto.request.UpdatePasswordRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;
import com.mongle.userservice.dto.response.GetUserInfoResponseDTO;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

public interface UserService {
    void deleteUser(String userPk);
    void updateUserName(String userPk, UpdateNameRequestDTO request);
    void updateUserNickName(String userPk, UpdateNickNameRequestDTO request);
    void logout(String userPk, HttpServletResponse response);
    void updateUserPassword(String userPk, UpdatePasswordRequestDTO request);
    GetUserInfoResponseDTO getUserInfo(String userPk);
    List<String[]> getNicknamesByUserId(List<String> idList);
    String getUUID(String id);
    String getId(String uuid);
    List<String> getIdList(String id, String userPk);
}
