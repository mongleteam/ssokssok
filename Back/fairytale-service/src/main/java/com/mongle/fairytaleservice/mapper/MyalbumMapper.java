package com.mongle.fairytaleservice.mapper;

import com.mongle.fairytaleservice.dto.response.GetMyalbumResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyalbumMapper {
    List<GetMyalbumResponseDTO> findFairytaleTitleByUserId(@Param("userPk") String userPk);
    int deleteMyalbums(@Param("myalbumPks") List<Integer> myalbumPks,@Param("userPk") String userPk);
}
