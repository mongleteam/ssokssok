import React, { useEffect, useRef, useState } from "react";
import { useMicVolume } from "../../hooks/useMicVolume"; // 방금 만든 훅

const WebcamSilentMission = ({ data, onComplete }) => {
  const videoRef = useRef(null);
  const volume = useMicVolume(); // 실시간 마이크 볼륨 (0 ~ 1)
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState("미션 준비 중...");
  const [quietDuration, setQuietDuration] = useState(0); // ms 단위
  const QUIET_THRESHOLD = 0.05; // 이 값 이하로 유지하면 조용하다고 판단
  const REQUIRED_DURATION = 5000; // 5초 (ms)

  const volumeRef = useRef(volume);

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

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // 볼륨 기준으로 조용한 상태 체크
  useEffect(() => {
    if (isSuccess) return;
  
    const interval = setInterval(() => {
      const currentVolume = volumeRef.current;
  
      if (currentVolume < QUIET_THRESHOLD) {
        setQuietDuration((prev) => prev + 100);
        setStatus("🧘‍♀️ 조용히 잘하고 있어요...");
      } else {
        setQuietDuration(0);
        setStatus("❗ 소리가 감지됐어요! 다시 조용히 해주세요.");
      }
    }, 100);
  
    return () => clearInterval(interval);
  }, [isSuccess]);


  // 성공 판정
  useEffect(() => {
    if (quietDuration >= REQUIRED_DURATION && !isSuccess) {
      setIsSuccess(true);
      setStatus("🎉 미션 성공! 정말 조용했어요.");
    // ✅ 부모 컴포넌트에게 미션 성공 알려줌!
    if (onComplete) {
        setTimeout(() => {
          onComplete(); // 👉 이게 핵심!
        }, 100); // (선택) 살짝 딜레이 주면 안정적
      }
    }
  }, [quietDuration, isSuccess, onComplete]);

  return (
    <>
      {/* ✅ 완전히 삽화와 동일한 구조 */}
      <div className="relative w-[40rem] h-auto torn-effect mt-6 mb-3 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto object-cover scale-x-[-1]"
        />
      </div>

      {/* ✅ 미션 설명 UI는 아래쪽에 */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="text-xl text-white bg-black/50 px-4 py-2 rounded-md">
          {status}
        </div>

        <div className="w-96 h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-100"
            style={{
              width: `${Math.min((quietDuration / REQUIRED_DURATION) * 100, 100)}%`,
            }}
          />
        </div>

        <p className="text-sm text-white">
          현재 볼륨: {volume.toFixed(3)} / 기준: {QUIET_THRESHOLD}
        </p>

        {isSuccess && (
          <div className="text-xl text-green-400 font-bold mt-2">✅ 미션 완료!</div>
        )}
      </div>
    </>
  );
};

export default WebcamSilentMission;
