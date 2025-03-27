import { authApi } from "./axiosConfig";

// 내 정보 조회
export const mypageInfoApi = () => {
    return authApi.get("/user")
}

// 닉네임 수정
export const updateNicknameApi = (newNickName) => {
    return authApi.put("/user/nickname", {newNickName})
}

// 회원 탈퇴
export const deleteUserApi = () => {
    return authApi.delete("/user")
}