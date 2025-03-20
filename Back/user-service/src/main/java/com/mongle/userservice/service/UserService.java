package com.mongle.userservice.service;

import com.mongle.userservice.dto.request.FindIdRequestDTO;
import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;
import com.mongle.userservice.dto.request.UpdatePasswordRequestDTO;
import com.mongle.userservice.dto.response.FindIdResponseDTO;

public interface UserService {
    void deleteUser(String userPk);
    void updateUserName(String userPk, UpdateNameRequestDTO request);
    void updateUserNickName(String userPk, UpdateNickNameRequestDTO request);
    FindIdResponseDTO findId(FindIdRequestDTO request);
    void updateUserPassword(String userPk, UpdatePasswordRequestDTO request);
}
