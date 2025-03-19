package com.mongle.userservice.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    private final ErroCode errorCode;

    public CustomException(ErroCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }
}
