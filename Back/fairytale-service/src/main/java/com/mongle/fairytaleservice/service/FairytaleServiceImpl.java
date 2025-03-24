package com.mongle.fairytaleservice.service;


import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleSimpleDTO;
import com.mongle.fairytaleservice.exception.CustomException;
import com.mongle.fairytaleservice.exception.ErrorCode;
import com.mongle.fairytaleservice.mapper.FairytaleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.mongle.fairytaleservice.entity.myalbum;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FairytaleServiceImpl implements FairytaleService {
    private final FairytaleMapper fairytaleMapper;
    private final S3Uploader s3Uploader;

    @Override
    public FairytaleInfoResponseDTO findFairytaleById(Integer fairytalePk, String userPk) {
        // 1. 동화책 정보 가져오기
        var fairytale = fairytaleMapper.findFairytaleById(fairytalePk);
        if (fairytale == null) {
            throw new CustomException(ErrorCode.UNKNOWN_FAIRYTALE);
        }

        // 2. 진행상황 리스트 가져오기
        var progressList = fairytaleMapper.findProgressListByFairytaleAndUser(fairytalePk, userPk);

        // 3. 응답 DTO 조립
        var response = new FairytaleInfoResponseDTO();
        response.setFairytale(fairytale);
        response.setProgressList(progressList);

        return response;
    }

    @Override
    public List<FairytaleSimpleDTO> getAllFairytale(){
        return fairytaleMapper.findAllFairytale();
    }

    @Override
    public String uploadAndSave(MultipartFile file, String userPk, Integer fairytalePk) {
        // 1. S3 업로드
        String s3Url = s3Uploader.upload(file, "myalbum/" + userPk ); // "myalbum" 폴더에 저장

        // 2. DB 저장
        myalbum album = myalbum.builder()
                .userPk(userPk)
                .fairytalePk(fairytalePk)
                .myalbumDataImgUrl(s3Url)
                .createdDate(LocalDateTime.now())
                .build();

        fairytaleMapper.insertMyAlbum(album);

        // 3. 업로드된 S3 URL 반환
        return s3Url;
    }
}
