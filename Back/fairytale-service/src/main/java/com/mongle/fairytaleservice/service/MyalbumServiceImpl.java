package com.mongle.fairytaleservice.service;


import com.mongle.fairytaleservice.dto.response.GetMyalbumResponseDTO;
import com.mongle.fairytaleservice.mapper.MyalbumMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyalbumServiceImpl implements MyalbumService {
    private final MyalbumMapper myalbumMapper;

    @Override
    public List<GetMyalbumResponseDTO> getMyalbumList(String userPk){
        return myalbumMapper.findFairytaleTitleByUserId(userPk);
    }
}
