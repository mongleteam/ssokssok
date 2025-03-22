import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"


// 로컬 스토리지에서 토큰 관리
const getAccessToken = () => localStorage.getItem("accessToken")
const setAccessToken = (token) => localStorage.setItem("accessToken", token)
const removeAccessToken = () => localStorage.removeItem("accessToken")

const springApi = axios.create({
    baseURL: import.meta.env.VITE_SPRING_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

// // AccessToken 만료 확인
// const isTokenExpired = (token) => {
//     if (!token) return true
//     try {
//         const {exp} = jwtDecode(token)
//         return Date.now() >= exp * 1000
//     } catch (e) {
//         return true
//     }
// }

// // 요청마다 accessToken 추가
// springApi.interceptors.request.use(async (config) => {
//     let token = getAccessToken()
  
//     if (isTokenExpired(token)) {
//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_SPRING_API_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );
//         token = res.data.accessToken
//         setAccessToken(token)
//       } catch (err) {
//         removeAccessToken()
//         window.location.href = "/login"
//         return Promise.reject(err)
//       }
//     }
  
//     config.headers.Authorization = `Bearer ${token}`
//     return config;
//   }, (error) => Promise.reject(error))

export default springApi

