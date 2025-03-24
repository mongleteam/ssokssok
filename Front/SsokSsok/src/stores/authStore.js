// Zustand를 통한 토큰 상태 관리 (accessToken 저장, 로그인/로그아웃)
import { create } from "zustand"
import { isTokenExpired } from "../utils/tokenUtils"
import axios from "axios"
const useAuthStore = create((set) => {
  const storedToken = localStorage.getItem("accessToken")
  const validToken = storedToken && !isTokenExpired(storedToken)

  return {
    accessToken: storedToken,
    isAuthenticated: validToken,

    setAccessToken: (token) => {
      localStorage.setItem("accessToken", token)
      set({ accessToken: token, isAuthenticated: true })
    },

    logout: async () => {
      try {
        // 서버에 로그아웃 요청
        await axios.post(
          `${import.meta.env.VITE_SPRING_API_URL}/user/logout`,
          {},
          { withCredentials: true }
        )
        console.log("백엔드드 로그아웃 성공")
      } catch (err) {
        console.warn("백엔드드 로그아웃 실패", err)
      }
      // 클라이언트 상태 초기화
      localStorage.removeItem("accessToken")
      set({ accessToken: null, isAuthenticated: false })
      window.location.replace("/login")
    },

  }
})

export default useAuthStore