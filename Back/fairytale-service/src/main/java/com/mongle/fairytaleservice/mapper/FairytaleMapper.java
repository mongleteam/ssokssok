package com.mongle.fairytaleservice.mapper;

import com.mongle.fairytaleservice.dto.response.FairytaleInfoDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import com.mongle.fairytaleservice.dto.response.FairytaleSimpleDTO;
import com.mongle.fairytaleservice.dto.response.ProgressInfoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.mongle.fairytaleservice.entity.myalbum;

import java.util.List;

@Mapper
public interface FairytaleMapper {
    FairytaleInfoDTO findFairytaleById(@Param("fairytalePk") Integer fairytalePk);

    List<ProgressInfoDTO> findProgressListByFairytaleAndUser(
            @Param("fairytalePk") Integer fairytalePk,
            @Param("userPk") String userPk
    );
    List<FairytaleSimpleDTO> findAllFairytale();
    void insertMyAlbum(myalbum album);
}
