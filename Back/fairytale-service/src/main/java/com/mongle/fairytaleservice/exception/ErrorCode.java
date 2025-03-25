package com.mongle.fairytaleservice.exception;

import lombok.*;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    UNKNOWN_FAIRYTALE(5001, "동화책 정보가 존재하지 않습니다."),
    UNKNOWN_PAGE(5002, "현재 페이지는 필수입니다."),
    DIFFER_USER(5003, "진행사항에 대한 권한이 없습니다."),
    UNKNOWN_PHOTO(5004, "사진을 삭제할 권한이 없습니다."),
    NOSELECT_PHOTO(5005, "선택한 사진이 없습니다.");
    
    private final int code;
    private final String defaultMessage;
}
