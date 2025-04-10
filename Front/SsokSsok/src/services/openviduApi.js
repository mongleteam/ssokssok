import axios from "axios";

const API_BASE = import.meta.env.VITE_SPRING_API_URL;

export const getTokenFromServer = async (roomId) => {
  try {
    // console.log("🔐 [OpenVidu] 세션 생성 요청:", roomId);
    await axios.post(`${API_BASE}meeting/sessions`, {
      customSessionId: roomId,
    });

    // console.log("🎫 [OpenVidu] 토큰 요청:", roomId);
    const res = await axios.post(`${API_BASE}meeting/sessions/${roomId}/connections`);

    // ✅ 백엔드가 문자열을 직접 반환하므로 그대로 사용
    const token = res.data;
    // console.log("✅ [OpenVidu] 토큰 발급 완료:", token);

    return token;
  } catch (err) {
    console.error("❌ [OpenVidu] 토큰 생성 실패:", err);
    throw err;
  }
};
