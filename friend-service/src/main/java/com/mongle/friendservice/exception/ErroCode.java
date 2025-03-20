package com.mongle.friendservice.exception;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErroCode {
    DUPLICATE_FRIEND_RELATION(4001, "이미 친구 관계입니다");
//    DUPLICATE_MEMBER_ID(2001, "이미 사용중인 아이디입니다"),
//    DUPLICATE_MEMBER_EMAIL(2002, "이미 사용중인 이메일입니다"),
//    DUPLICATE_MEMBER_NICKNAME(2003, "이미 사용중인 닉네임입니다"),
//    NOT_EXIST_MEMBER_ID(2004, "존재하지 않는 아이디입니다."),
//    INCORRECT_MEMBER_PASSWORD(2005, "비밀번호가 일치하지 않습니다."),
//    NOT_EXIST_MEMBER_EMAIL(2006, "이메일이 존재하지 않습니다."),
//
//    UNAUTHORIZED_ACCESS(3001, "인증되지 않은 사용자입니다."),
//    INVALID_TOKEN(3002, "유효하지 않은 토큰입니다."),
//    INVALID_INPUT(3003, "닉네임을 입력해주세요.");

    private final int code;
    private final String defaultMessage;
}