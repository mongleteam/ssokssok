import React, { useEffect, useRef, useState } from "react";
import { useMicVolume } from "../../../hooks/useMicVolume";
import { sendMessage } from "../../../services/socket";

const SilentMissionMulti = ({
  onSuccess,           // 미션 성공 콜백 (MultiPage에서 전달)
  setStatusContent,    // 미션 진행 상태 메시지 렌더링용 콜백 (MissionScreen)
  roomId,              // 소켓 전송용 방 ID
  userName,            // 현재 유저 이름 (헨젤/그레텔)
  publisher,           // OpenVidu publisher 객체
}) => {
  const videoRef = useRef(null);
  const volume = useMicVolume(); // 🔇 마이크 볼륨 추적 훅
  const [isSuccess, setIsSuccess] = useState(false);
  const [quietDuration, setQuietDuration] = useState(0); // ms 누적
  const [missionStarted, setMissionStarted] = useState(false);

  const QUIET_THRESHOLD = 0.04;      // 🔇 음성 임계값
  const REQUIRED_DURATION = 5000;    // ✅ 조용히 있어야 하는 시간 (5초)

  // ✅ OpenVidu publisher에서 비디오 스트림 바인딩
  useEffect(() => {
    if (videoRef.current && publisher?.stream) {
      const stream = publisher.stream.getMediaStream();
      videoRef.current.srcObject = stream;
    }
  }, [publisher]);

  // ✅ 실시간 볼륨 추적
  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // ✅ 미션 시작 시 조용한 시간 측정 시작
  useEffect(() => {
    if (!missionStarted || isSuccess) return;

    const interval = setInterval(() => {
      const currentVolume = volumeRef.current;
      if (currentVolume < QUIET_THRESHOLD) {
        setQuietDuration((prev) => prev + 100); // 0.1초 단위로 누적
      } else {
        setQuietDuration(0); // 소리 나면 리셋
      }
    }, 100);

    return () => clearInterval(interval);
  }, [missionStarted, isSuccess]);

  // ✅ 성공 조건 충족 시 처리
  useEffect(() => {
    if (quietDuration >= REQUIRED_DURATION && !isSuccess) {
      setIsSuccess(true);

      // 1. 소켓으로 성공 메시지 전송
      sendMessage("isSuccess", {
        senderName: userName,
        roomId,
        isSuccess: "성공",
      });

      // 2. 상위 콜백 호출
      onSuccess?.();
    }
  }, [quietDuration, isSuccess]);

  // ✅ MissionScreen에 상태 메시지 전송
  useEffect(() => {
    if (!setStatusContent) return;
    const secondsLeft = Math.max(0, Math.ceil((REQUIRED_DURATION - quietDuration) / 1000));

    const ui = (
      <div className="text-3xl font-cafe24 font-bold text-center text-blue-800 animate-pulse">
        {isSuccess
          ? "✅ 성공! 다음 페이지로 넘어가세요."
          : `조용히 하세요... ${secondsLeft}초 남음`}
      </div>
    );
    setStatusContent(ui);
  }, [quietDuration, isSuccess]);

  // ✅ 자동 미션 시작
  useEffect(() => {
    setMissionStarted(true);
  }, []);

  return (
    <div className="relative w-[48rem] aspect-video torn-effect overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1] hidden"
      />
    </div>
  );
};

export default SilentMissionMulti;