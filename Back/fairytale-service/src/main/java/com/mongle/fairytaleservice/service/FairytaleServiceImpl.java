package com.mongle.fairytaleservice.service;


import com.mongle.fairytaleservice.dto.request.ProgressInsertRequestDTO;
import com.mongle.fairytaleservice.dto.request.ProgressUpdateRequestDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleSimpleDTO;
import com.mongle.fairytaleservice.dto.response.ProgressInfoDTO;
import com.mongle.fairytaleservice.exception.CustomException;
import com.mongle.fairytaleservice.exception.ErrorCode;
import com.mongle.fairytaleservice.mapper.FairytaleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.mongle.fairytaleservice.entity.myalbum;
import com.mongle.fairytaleservice.entity.progress;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

        // 싱글 진행상황 1개
        var single = fairytaleMapper.findSingleProgress(fairytalePk, userPk);

        // 멀티 진행상황 최신 3개
        var multiList = fairytaleMapper.findMultiProgress(fairytalePk, userPk);

        List<ProgressInfoDTO> progressList = new ArrayList<>();
        progressList.addAll(single);
        progressList.addAll(multiList);
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

    @Override
    public int createProgress(ProgressInsertRequestDTO requestDTO) {
        // 1. now_page 값이 없으면 예외 처리
        if (requestDTO.getNowPage() == null) {
            throw new CustomException(ErrorCode.UNKNOWN_PAGE);
        }

        // 2. Progress 생성하는 리퀘스트 DTO -> 엔티티로 설정해준 progress로 변환
        progress progress = new progress();
        progress.setNowPage(requestDTO.getNowPage());
        progress.setMode(requestDTO.getMode().name());
        progress.setFriendId(requestDTO.getFriendId());
        progress.setUserPk(requestDTO.getUserPk());
        progress.setFairytalePk(requestDTO.getFairytalePk());
        progress.setRole(requestDTO.getRole());
        progress.setFinish(false);  // 기본값 false

        // 3. progress DB에 삽입
        fairytaleMapper.insertProgress(progress);

        return progress.getProgressPk();
    }
    @Override
    public void updateProgress(int progressPk, String userPk, ProgressUpdateRequestDTO requestDTO){
        progress existing = fairytaleMapper.selectProgressById(progressPk);

        // 1. 이 진행상황이 다른 사용자면 에러
        if(!existing.getUserPk().equals(userPk)){
            throw new CustomException(ErrorCode.DIFFER_USER);
        }

        // 2. 진행상황 업데이트
        fairytaleMapper.updateProgress(
                progressPk,
                requestDTO.getNowPage(),
                requestDTO.isFinish()
        );
    }

}
