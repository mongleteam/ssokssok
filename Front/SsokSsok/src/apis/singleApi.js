import { authApi } from "./axiosConfig";

// 동화 스토리 진행 시작 생성
export const createSingleProgressApi = async (data) => {
    return await authApi.post("/fairytale/create", data);
};