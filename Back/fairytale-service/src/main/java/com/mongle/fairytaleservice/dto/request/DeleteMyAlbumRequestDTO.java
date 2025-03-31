package com.mongle.fairytaleservice.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class DeleteMyAlbumRequestDTO {
    private List<Integer> myalbumPks;
}
