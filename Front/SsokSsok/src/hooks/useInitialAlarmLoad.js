import { useEffect } from "react";
import { notiListApi } from "../apis/notificationApi";
import { useAlarmStore } from "../stores/alarmStore";

const useInitialAlarmLoad = () => {
  const setAlarms = useAlarmStore((state) => state.setAlarms);
  const isLoaded = useAlarmStore((state) => state.isLoaded);

  useEffect(() => {
    // console.log("🚀 useInitialAlarmLoad 실행됨");
    if (isLoaded) return; // 이미 로딩된 경우 중복 방지

    const fetchAlarms = async () => {
      try {
        const response = await notiListApi();
        // console.log("✅ 알림 API 응답:", response.data); 
    
        const notifications = response.data?.data?.notifications;
    
        if (Array.isArray(notifications) && notifications.length > 0) {
          // console.log("📥 기존 알림 있음:", notifications);
          setAlarms(notifications); // 이제 제대로 상태 저장됨!
        } else {
          // console.log("📭 기존 알림 없음 또는 잘못된 형식");
        }
      } catch (err) {
        // console.error("❌ 초기 알림 불러오기 실패:", err);
      }
    };
    

    fetchAlarms();
  }, [setAlarms, isLoaded]);
};

export default useInitialAlarmLoad;
