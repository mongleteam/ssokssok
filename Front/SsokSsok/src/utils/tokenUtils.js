import { jwtDecode } from "jwt-decode"

// JWT 유효성 검사 (로그인된 토큰이 유효한지 확인)

export const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const { exp } = jwtDecode(token)
    return Date.now() >= exp * 1000
  } catch (e) {
    console.warn("토큰 디코딩 실패:", e)
    return true
  }
}
