import { authApi } from "./axiosConfig";

// 알림함 조회 
export const notiListApi = () => {
    return authApi.get('/notification/list')
}