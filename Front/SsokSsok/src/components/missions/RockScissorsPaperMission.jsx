import React, { useRef, useEffect, useState } from "react";
import { useRPSGesture } from "../../hooks/useHandGesture";

const RockScissorsPaperMission = ({ onComplete, setStatusContent }) => {
  const videoRef = useRef(null);
  const prevMessageRef = useRef("");
  const prevCountdownRef = useRef(null); // 이전 countdown 메시지 기억
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [missionMessage, setMissionMessage] = useState(""); // ✅ 메시지 상태 추가

  const { playerGesture, witchGesture, result } = useRPSGesture(videoRef, {
    width: 640,
    height: 480,
    isActive: isPlaying,
  });

  const handledRef = useRef(false); // 무한 루프 방지

  useEffect(() => {
    if (!gameOver || !result || result === "Waiting..." || handledRef.current)
      return;

    handledRef.current = true; // 한 번만 처리하도록 설정

    if (result === "win") {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    } else {
      setMissionMessage(
        result === "lose"
          ? "😵 패배 - 다시 도전해보세요!"
          : "😐 무승부 - 다시 도전해보세요!"
      );
    }
  }, [result, gameOver, onComplete]);

  // 게임 시작 함수
  const startGame = () => {
    handledRef.current = false;
    setGameOver(false);
    setIsPlaying(true);
    setCountdown(3);
    setMissionMessage("🧙 가위바위보 준비 중...");

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        setTimeout(() => {
          setIsPlaying(false);
          setGameOver(true);
        }, 1000);
      }
    }, 1000);
  };

  // 상태 메시지 UI 업데이트
  useEffect(() => {
    if (!setStatusContent) return;

    if (isPlaying && countdown !== null) {
      if (countdown !== prevCountdownRef.current) {
        prevCountdownRef.current = countdown;
        setStatusContent(
          <div className="text-5xl text-center font-bold text-rose-600 animate-bounce">
            {countdown}
          </div>
        );
      }
    } else if (missionMessage && missionMessage !== prevMessageRef.current) {
      prevMessageRef.current = missionMessage;
      setStatusContent(
        <div className="text-3xl text-center font-bold text-amber-700 animate-pulse">
          {missionMessage}
        </div>
      );
    }
  }, [isPlaying, countdown, missionMessage, setStatusContent]);


  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />
      <div className="absolute bottom-6 w-full text-center">
        {!isPlaying && !countdown && gameOver && result !== "win" && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg text-xl hover:bg-orange-700"
          >
            다시 도전
          </button>
        )}
        {!isPlaying && !countdown && !gameOver && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700"
          >
            도전
          </button>
        )}
      </div>
    </div>
  );
};

export default RockScissorsPaperMission;
