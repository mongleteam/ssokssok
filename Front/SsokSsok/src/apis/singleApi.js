import { authApi } from "./axiosConfig";

// 동화 스토리 진행 시작 생성
export const createSingleProgressApi = async (data) => {
    return await authApi.post("/fairytale/create", data);
};

// 싱글모드 동화 스토리 진행상황 업데이트 APi
export const updateSingleProgressApi = async (progressPk, body) => {
    return authApi.patch(`/fairytale/${progressPk}`, body);
};