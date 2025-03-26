import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../stores/authStore"
import { isTokenExpired } from "../utils/tokenUtils"
import { refreshTokenApi } from "./authApi"

// 로컬 스토리지에서 토큰 관리
const getAccessToken = () => localStorage.getItem("accessToken")
const setAccessToken = (token) => localStorage.setItem("accessToken", token)
const removeAccessToken = () => localStorage.removeItem("accessToken")

const springApi = axios.create({
    baseURL: import.meta.env.VITE_SPRING_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// 언니들이 사용할 ㄱ ㅓ authApi
const authApi = axios.create({
    baseURL: import.meta.env.VITE_SPRING_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApi.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshTokenApi();
        const newAccessToken = res.data.data.accessToken;

        // Zustand나 localStorage에 새 토큰 저장
        useAuthStore.getState().setAccessToken(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);

        // 요청 헤더 갱신 후 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return springApi(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 → 로그아웃 처리
        useAuthStore.getState().logout();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default springApi
export { authApi }
