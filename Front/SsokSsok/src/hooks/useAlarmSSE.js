import { useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useAlarmStore } from "../stores/alarmStore";

const useAlarmSSE = (accessToken) => {
  const addAlarm = useAlarmStore((state) => state.addAlarm);

  useEffect(() => {
    if (!accessToken) {
      console.warn("🚫 SSE 연결 실패: accessToken 없음");
      return;
    }

    console.log("🧩 SSE 연결 시도...");

    const eventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_SPRING_API_URL}notification/connect`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true, // Refresh Token 쿠키 자동 포함
      }
    );
    console.log("✅ SSE 연결 URL:", import.meta.env.VITE_SPRING_API_URL);
    console.log("🚀 AccessToken 확인:", accessToken);

    // 🔹 connect 이벤트 처리
    eventSource.addEventListener("connect", (event) => {
      const data = JSON.parse(event.data);
      console.log("🟢 SSE 연결 완료 메시지:", data);
    });

    // 🔹 notification 이벤트 처리
    eventSource.addEventListener("notification", (event) => {
      const data = JSON.parse(event.data);
      console.log("📨 새 알림 도착:", data);
      addAlarm(data);
    });

    eventSource.addEventListener("heartbeat", (event) => {
      console.log("💓 heartbeat:", event.data);
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE 연결 오류:", err);
      eventSource.close();
    };

    return () => {
      console.log("📴 SSE 연결 종료");
      eventSource.close();
    };
  }, [accessToken, addAlarm]);
};

export default useAlarmSSE;
