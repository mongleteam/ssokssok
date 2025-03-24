// Zustand를 통한 토큰 상태 관리 (accessToken 저장, 로그인/로그아웃웃)
import { create } from "zustand"
import { isTokenExpired } from "../utils/tokenUtils"

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

    logout: () => {
      localStorage.removeItem("accessToken")
      set({ accessToken: null, isAuthenticated: false })
      window.location.replace("/login")
    },
  }
})

export default useAuthStore