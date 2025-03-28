import { useEffect, useRef } from "react";
import { notiListApi } from "../apis/notificationApi";
import { useAlarmStore } from "../stores/alarmStore";

const useInitialAlarmLoad = () => {
  const fetchedRef = useRef(false);
  const setAlarms = useAlarmStore.getState().setAlarms;
  const isLoaded = useAlarmStore.getState().isLoaded;

  useEffect(() => {
    if (fetchedRef.current || isLoaded) return;

    const fetchAlarms = async () => {
      try {
        const res = await notiListApi();
        if (Array.isArray(res.data)) {
          console.log("📥 초기 알림 불러옴:", res.data);
          setAlarms(res.data); // ✅ 상태 업데이트
          fetchedRef.current = true;
        }
      } catch (err) {
        console.error("❌ 알림 불러오기 실패:", err);
      }
    };

    fetchAlarms();
  }, []);
};

export default useInitialAlarmLoad;
