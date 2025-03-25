package com.mongle.fairytaleservice.service;

import com.mongle.fairytaleservice.dto.response.GetMyalbumResponseDTO;

import java.util.List;

public interface MyalbumService {
    List<GetMyalbumResponseDTO> getMyalbumList(String userPk);

}
