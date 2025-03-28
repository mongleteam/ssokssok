import { useEffect } from "react";
import { notiListApi } from "../apis/notificationApi";
import { useAlarmStore } from "../stores/alarmStore";

const useInitialAlarmLoad = () => {
  const setAlarms = useAlarmStore((state) => state.setAlarms);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const res = await notiListApi();
        if (Array.isArray(res.data)) {
          setAlarms(res.data); // ✅ Zustand에 기존 알림 초기화
          console.log("📥 초기 알림 리스트 로딩 완료:", res.data);
        }
      } catch (err) {
        console.error("❌ 초기 알림 리스트 로딩 실패:", err);
      }
    };

    fetchAlarms();
  }, [setAlarms]);
};

export default useInitialAlarmLoad;
