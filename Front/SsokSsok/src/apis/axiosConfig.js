import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../stores/authStore"
import { isTokenExpired } from "../utils/tokenUtils"

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

authApi.interceptors.request.use(async (config) => {
    const { accessToken, setAccessToken, logout } = useAuthStore.getState()
  
    let token = accessToken
  
    if (isTokenExpired(token)) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_SPRING_API_URL}/auth/refresh`, {}, { withCredentials: true })
        token = res.data.data.accessToken
        setAccessToken(token)
      } catch (err) {
        logout()
        return Promise.reject(err)
      }
    }
  
    config.headers.Authorization = `Bearer ${token}`
    return config
  }, (error) => Promise.reject(error))

export default springApi

