import { authApi } from "./axiosConfig";

// 책 진행사항 조회
export const bookInfoApi = () => {
    return authApi.get('fairytale/1')
}

// 따봉캡처
export const sendThumbImage = (formData) => {
    return authApi.post("fairytale/interaction-img", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}