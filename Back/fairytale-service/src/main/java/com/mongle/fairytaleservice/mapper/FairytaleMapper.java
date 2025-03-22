package com.mongle.fairytaleservice.mapper;

import com.mongle.fairytaleservice.dto.response.FairytaleInfoResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FairytaleMapper {
    FairytaleInfoResponseDTO findFairytaleById(@Param("fairytalePk") Integer fairytalePk);
}
