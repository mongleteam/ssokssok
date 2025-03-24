import { authApi } from "./axiosConfig";

// 친구 검색 
export const searchFriendApi = (keyword) => {
    return authApi.get(`/user/id-list?id=${keyword}`)
}

// 친구 추가
export const plusFriendApi = (friendId) => {
    return authApi.post('/friend/regist', {friendId})
}