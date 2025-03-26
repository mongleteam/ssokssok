import { authApi } from "./axiosConfig";

// 책 진행사항 조회
export const bookInfoApi = () => {
    return authApi.get('fairytale/1')
}