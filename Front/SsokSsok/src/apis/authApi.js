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
// export const refreshTokenApi = () => {
//     return springApi.post("/auth/refresh", {}, {
//         withCredentials: true,
//     })
// }
