import { authApi } from "./axiosConfig";

// 내 정보 조회
export const mypageInfoApi = () => {
    return authApi.get("/user")
}