package com.mongle.friendservice.exception;

import com.mongle.friendservice.common.ApiResponseJson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponseJson> handleCustomException(CustomException e) {
        return ResponseEntity.badRequest()
                .body(new ApiResponseJson(false, e.getErrorCode().getCode(), e.getMessage(), null));
    }
}

