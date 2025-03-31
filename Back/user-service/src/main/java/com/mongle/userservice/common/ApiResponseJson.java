package com.mongle.userservice.common;

import lombok.*;


@Getter
@ToString
@NoArgsConstructor
public class ApiResponseJson {
    // cicd test
    public Boolean isSuccess;
    public String message;
    public int code;
    public Object data;

    public ApiResponseJson(Boolean isSuccess, int code, String message, Object data) {
        this.isSuccess = isSuccess;
        this.message = message;
        this.code = code;
        this.data = data;
    }
}
