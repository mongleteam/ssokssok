// 싱글 모드 쿠키 미션

import React, { useRef, useEffect, useState } from "react";
import { useHolisticMouthTracker } from "../../hooks/useMouthTracker";

const EatCookieMission = ({
  onComplete,
  setStatusContent,
  missionProps,
  assets,
}) => {
  const videoRef = useRef(null);
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [missionMessage, setMissionMessage] = useState("");
  const soundSrc = missionProps.soundEffect?.[0];
  const MAX_COOKIE = 3;

  // 쿠키 이미지 배열 
  const cookieImages = missionProps.instructionImages;
  // count가 0,1,2일 때 해당 이미지 사용, 그 이후엔 마지막 이미지로 표시
  const currentCookieImage =
    cookieImages[count] || cookieImages[cookieImages.length - 1];

  //내가 만든 useMouthTracker 훅을 통해 입 벌림 상태 받아오기
  const { mouthOpen } = useHolisticMouthTracker(videoRef, {
    width: 640,
    height: 480,
  });

  const prevMouthOpenLocal = useRef(null);
  // 입 벌림 상태 변화에 따른 처리 (true → false 전환 시에만 count 증가)
  useEffect(() => {
    // 초기 렌더링 시에는 이전 상태를 설정하고 아무것도 하지 않음
    if (prevMouthOpenLocal.current === null) {
      prevMouthOpenLocal.current = mouthOpen;
      return;
    }
    // 만약 이전 값이 true였고 현재 false이면 (입이 열렸다가 닫힘 전환)
    if (prevMouthOpenLocal.current === true && mouthOpen === false) {
      if (soundSrc && assets[soundSrc]) {
        const audio = new Audio(assets[soundSrc]);
        audio.play().catch(() => {});
      }
      setCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= MAX_COOKIE) {
          setSuccess(true);
        }
        return newCount;
      });
    }
    // 현재 mouthOpen 값을 이전 값으로 저장
    prevMouthOpenLocal.current = mouthOpen;
  }, [mouthOpen, soundSrc, assets]);

  // 성공 조건에 따른 메시지 업데이트 및 onComplete 호출
  useEffect(() => {
    if (count >= MAX_COOKIE) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete && onComplete();
    }
  }, [count, onComplete]);

  // 상태 UI 업데이트
  useEffect(() => {
    if (!setStatusContent) return;
    const ui = missionMessage ? (
      <div className="text-3xl text-center font-bold text-green-700 animate-pulse">
        {missionMessage}
      </div>
    ) : (
      <div className="text-5xl font-cafe24 text-center font-bold text-stone-900">
        {count} / {MAX_COOKIE}
      </div>
    );
    setStatusContent(ui);
  }, [count, missionMessage]);

  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* 쿠키 이미지 오버레이 (성공 전만 표시) */}
      <img
        src={assets[currentCookieImage]}
        alt="cookie"
        className={`absolute w-48 h-48 transition-opacity duration-500 ease-in-out ${
          success ? "opacity-0" : "opacity-100"
        }`}
        style={{
          top: "80%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export default EatCookieMission;
