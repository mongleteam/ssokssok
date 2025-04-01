import React, { useRef, useEffect, useState } from "react";
import { useRPSGesture } from "../../hooks/useHandGesture";
import startBtn from "../../assets/images/btn_green.png";



const gestureToEmoji = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};
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
      onComplete && onComplete();
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
    prevMessageRef.current = ""; // ✅ 이전 메시지 초기화
    prevCountdownRef.current = null;

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

      // 카운트다운 진행 중
      if (isPlaying && countdown !== null) {
        if (countdown !== prevCountdownRef.current) {
          prevCountdownRef.current = countdown;
          setStatusContent(
            <div className="text-5xl text-center font-bold animate-bounce font-cafe24">
              {countdown}
            </div>
          );
        }
        return;
      }

      // 초기 상태: 게임 시작 전 (isPlaying, countdown, gameOver 모두 false)
      // missionMessage가 아직 설정되지 않은 경우 도전 버튼을 보여줌
      if (!isPlaying && !countdown && !gameOver && missionMessage === "") {
        setStatusContent(
          <div className="text-center text-3xl font-bold text-amber-700 animate-pulse space-y-4 font-cafe24">
            <button
              onClick={startGame}
              className="relative inline-block text-black rounded-lg text-xl"
            >
              <img src={startBtn} alt="도전 버튼" className="w-48 mx-auto" />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl mb-2">
                도전
              </span>
            </button>
          </div>
        );
        prevMessageRef.current = "";
        return;
      }

      // 게임 종료 후 missionMessage가 설정된 경우 (승리, 패배, 무승부)
      if (!isPlaying && !countdown && (gameOver || missionMessage)) {
        const showRetryButton = gameOver && result !== "win";
        const showStartButton = !gameOver; // gameOver가 false이면 재도전이 아니라 도전 버튼

        setStatusContent(
          <div
            className="relative flex flex-row items-center justify-center gap-4 text-center text-3xl font-bold text-amber-700 animate-pulse font-cafe24"
            style={{ transform: "translateY(-20px)" }}
          >
            <div>{missionMessage}</div>
            {(showRetryButton || showStartButton) && (
              <button
                onClick={startGame}
                className="relative inline-block text-black rounded-lg text-xl"
              >
                <img src={startBtn} alt="버튼" className="w-48 mx-auto" />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl mb-2">
                  {showRetryButton ? "재도전" : "도전"}
                </span>
              </button>
            )}
          </div>
        );
        prevMessageRef.current = missionMessage;
      }
    }, [isPlaying, countdown, missionMessage, gameOver, result, setStatusContent]);



  // 컴포넌트 언마운트 시 상태 리셋 (페이지를 벗어났다가 돌아올 때 이전 상태가 남지 않도록)
  useEffect(() => {
    return () => {
      setCountdown(null);
      setMissionMessage("");
      prevMessageRef.current = "";
      prevCountdownRef.current = null;
      setIsPlaying(false);
      setGameOver(false);
      setStatusContent?.(null);
    };
  }, []);
  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />

      <div className="absolute top-4 left-4 text-white text-3xl font-semibold bg-black/50 px-6 py-4 rounded-xl space-y-1 font-cafe24">
        <div>
          🧙 마녀: {witchGesture ? gestureToEmoji[witchGesture] : "..."}
        </div>
        <div>
          🧒 나: {playerGesture ? gestureToEmoji[playerGesture] : "..."}
        </div>
      </div>
 
    </div>
  );
};

export default RockScissorsPaperMission;
