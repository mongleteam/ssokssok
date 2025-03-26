package com.mongle.fairytaleservice.service;


import com.mongle.fairytaleservice.dto.response.GetMyalbumResponseDTO;
import com.mongle.fairytaleservice.exception.CustomException;
import com.mongle.fairytaleservice.exception.ErrorCode;
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

    @Override
    public void deleteMyalbum(List<Integer> myalbumPks, String userPk){
        if(myalbumPks == null || myalbumPks.isEmpty()){
            throw new CustomException(ErrorCode.NOSELECT_PHOTO);
        }

        int result = myalbumMapper.deleteMyalbums(myalbumPks,userPk);
        // result 값이 0이면 잘못된 user_pk이거나 다른 유저 사진이니까 삭제 불가
        if(result == 0){
            throw new CustomException(ErrorCode.UNKNOWN_PHOTO);
        }

    }
}
