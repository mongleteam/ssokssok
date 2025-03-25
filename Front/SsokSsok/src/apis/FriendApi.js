import { authApi } from "./axiosConfig";

// 친구 검색 
export const searchFriendApi = (keyword) => {
    return authApi.get(`/user/id-list?id=${keyword}`)
}

// 친구 추가 요청 
export const plusFriendApi = (friendId) => {
    return authApi.post('/friend/regist', {friendId})
}

// 친구 추가 요청 수락
export const acceptFriendApi = (friendId) => {
    return authApi.post('/friend/accept', {friendId})
}

// 친구 추가 요청 거절
export const rejectFriendApi = (friendId) => {
    return authApi.delete('/friend/reject', {friendId})
}

// 친구 목록 조회
export const myFriendApi = () => {
    return authApi.get('/friend/list')
}