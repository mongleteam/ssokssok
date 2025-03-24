package com.mongle.fairytaleservice.exception;

import lombok.*;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    UNKNOWN_FAIRYTALE(5001, "동화책 정보가 존재하지 않습니다.");
    
    private final int code;
    private final String defaultMessage;
}
