import springApi  from "./axiosConfig";

// 회원가입
export const signupApi = (signupData) => {
    return springApi.post("/auth/signup", signupData)
}

// 로그인
export const loginApi = (loginData) => {
    return springApi.post("/auth/login", loginData)
}


// 리프레쉬토큰
export const refreshTokenApi = () => {
    return springApi.post("/auth/refresh", {}, {
        withCredentials: true,
    })
}

// 아이디 중복체크 
export const checkIdApi = (keyword) => {
    return springApi.get(`/auth/check-id?id=${keyword}`)
}

// 닉네임 중복체크
export const checkNickNameApi = (keyword) => {
    return springApi.get(`/auth/check-nickname?nickname=${keyword}`)
}