package com.mongle.fairytaleservice.mapper;

import com.mongle.fairytaleservice.dto.response.FairytaleInfoDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleSimpleDTO;
import com.mongle.fairytaleservice.dto.response.ProgressInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.mongle.fairytaleservice.entity.myalbum;
import com.mongle.fairytaleservice.entity.progress;

import java.util.List;

@Mapper
public interface FairytaleMapper {
    FairytaleInfoDTO findFairytaleById(@Param("fairytalePk") Integer fairytalePk);

    List<ProgressInfoDTO> findSingleProgress(
            @Param("fairytalePk") Integer fairytalePk,
            @Param("userPk") String userPk
    );
    List<ProgressInfoDTO> findMultiProgress(
            @Param("fairytalePk") Integer fairytalePk,
            @Param("userPk") String userPk
    );
    List<FairytaleSimpleDTO> findAllFairytale();
    void insertMyAlbum(myalbum album);
    Integer selectExistingProgress(
            @Param("fairytalePk") Integer fairytalePk,
            @Param("userPk") String userPk,
            @Param("friendId") String friendId);
    int deleteProgress(@Param("progressPk") Integer progressPk);
    int insertProgress(progress progress);
    progress selectProgressById(@Param("progressPk") Integer progressPk);
    int updateProgress(
            @Param("progressPk") Integer progressPk,
            @Param("nowPage") Integer nowPage,
            @Param("finish") Boolean finish
           );
    int getLastInsertId();
}
