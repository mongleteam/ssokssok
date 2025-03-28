import React, { useEffect, useRef, useState } from "react";
import { useMicVolume } from "../../hooks/useMicVolume";
import speackIcon from "../../assets/images/speack_icon.png";

const WebcamSilentMission = ({ onComplete, setStatusContent }) => {
  const videoRef = useRef(null);
  const volume = useMicVolume();
  const [isSuccess, setIsSuccess] = useState(false);
  const [quietDuration, setQuietDuration] = useState(0);
  const QUIET_THRESHOLD = 0.04;
  const REQUIRED_DURATION = 5000;

  // 확인 로그 찍기
  // console.log("🔥 WebcamSilentMission 호출됨");
  // console.log("📦 setStatusContent 타입:", typeof setStatusContent);

  // ⏱ 남은 초 계산
  const secondsLeft = Math.max(0, Math.ceil((REQUIRED_DURATION - quietDuration) / 1000));

  // 웹캠 연결
  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("📷 웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  // 볼륨 ref 최신화
  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // 상태 텍스트
  const [statusText, setStatusText] = useState("미션 준비 중...");

  // 조용한 상태 감지
  useEffect(() => {
    if (isSuccess) return;

    const interval = setInterval(() => {
      const currentVolume = volumeRef.current;

      if (currentVolume < QUIET_THRESHOLD) {
        setQuietDuration((prev) => prev + 100);
        setStatusText("🧘‍♀️ 조용히 잘하고 있어요...");
      } else {
        setQuietDuration(0);
        setStatusText("❗ 다시 조용히 해주세요!");
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isSuccess]);

  // 성공 판정
  useEffect(() => {
    if (quietDuration >= REQUIRED_DURATION && !isSuccess) {
      setIsSuccess(true);
      setStatusText("🎉 미션 성공! 정말 조용했어요.");
      onComplete?.();
    }
  }, [quietDuration, isSuccess, onComplete]);

  // 상태 UI 업데이트
  useEffect(() => {
    if (!setStatusContent) return;
  
    const statusUI = (
      <div className="flex items-start justify-center gap-16 mt-6">
        {/* ⏱ 남은 시간 */}
        <div className="w-24 h-24 -mt-5 rounded-full border-4 border-black flex items-center justify-center text-5xl font-bold">
          {secondsLeft}
        </div>
  
        {/* 🔊 아이콘 + 막대 묶음 */}
        <div className="flex items-center gap-2">
          <img
            src={speackIcon}
            alt="소리 아이콘"
            className="w-14 h-14"
          />
          <div className="flex items-end gap-[7px] -mt-5">
            {Array.from({ length: 12 }, (_, i) => {
              const level = Math.pow(i / 12, 2);
              const isActive = volume >= level;
              const barColor = isActive ? getBarColor(level) : "bg-white";
              const height = 12 + i * 6;
  
              return (
                <div
                  key={i}
                  className={`${barColor} w-4 transition-all duration-100 rounded-sm`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  
    setStatusContent(statusUI);
  }, [volume, secondsLeft, setStatusContent]);
  
  // 더 쨍한 색상
  const getBarColor = (level) => {
    if (level < 0.1) return "bg-green-500";
    if (level < 0.6) return "bg-yellow-400";
    return "bg-red-600";
  };

  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />
    </div>
  );
};

export default WebcamSilentMission;
