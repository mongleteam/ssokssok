package com.mongle.userservice.service;

import com.mongle.userservice.dto.request.UpdateNameRequestDTO;
import com.mongle.userservice.dto.request.UpdateNickNameRequestDTO;

public interface UserService {
    void deleteUser(String userPk);
    void updateUserName(String userPk, UpdateNameRequestDTO request);
    void updateUserNickName(String userPk, UpdateNickNameRequestDTO request);
}
