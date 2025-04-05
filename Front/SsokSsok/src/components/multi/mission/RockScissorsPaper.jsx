// ✅ missions/RockScissorsPaperMission.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useHandGesture } from "../../../hooks/useHandGesture";
import startBtn from "../../../assets/images/btn_green.png";

// 가위바위보 이모지 매핑
const gestureToEmoji = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

const RockScissorsPaper = ({
  onComplete,
  setStatusContent,
  assets,
  publisher,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 게임 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [missionMessage, setMissionMessage] = useState("");
  const handledRef = useRef(false);

  // Hands API를 이용한 손 추적
  const [handLandmarks, setHandLandmarks] = useState(null);
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });
    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandLandmarks(results.multiHandLandmarks[0]);
      }
      // 캔버스에 그리려면 여기에 drawing_utils를 활용할 수도 있음
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // 예: drawLandmarks(ctx, results.multiHandLandmarks[0], {color: "#FF0000", lineWidth: 2});
      }
    });
    const setupCamera = async () => {
      if (videoRef.current && publisher?.stream) {
        const mediaStream = publisher.stream.getMediaStream();
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              await hands.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
          });
          camera.start();
        } catch (err) {
          console.error("Video play error", err);
        }
      }
    };
    setupCamera();
    return () => {
      hands.close();
    };
  }, [publisher]);

  // 가위바위보 제스처 훅 (손 랜드마크와 게임 진행 여부에 따라 제스처 판정)
  const { playerGesture, witchGesture, result, resetGesture } = useHandGesture(
    handLandmarks,
    isPlaying
  );

  // [1] 결과 판정 (한 번만 처리)
  useEffect(() => {
    if (!gameOver || !result || result === "Waiting..." || handledRef.current) {
      return;
    }
    handledRef.current = true;
    if (result === "win") {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    } else if (result === "lose") {
      setMissionMessage("😵 패배 - 다시 도전해보세요!");
    } else {
      setMissionMessage("😐 무승부 - 다시 도전해보세요!");
    }
  }, [result, gameOver, onComplete]);

  // [2] 게임 시작 (도전 버튼)
  const startGame = () => {
    resetGesture();
    handledRef.current = false;
    setGameOver(false);
    setIsPlaying(true);
    setMissionMessage("");
    setCountdown(3);
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

  // [3] 상태 UI (부모에 전달할 UI)
  const statusContent = useMemo(() => {
    if (isPlaying && countdown !== null) {
      return (
        <div className="text-5xl text-center font-bold animate-bounce font-cafe24">
          {countdown}
        </div>
      );
    }
    if (
      !isPlaying &&
      countdown === null &&
      !gameOver &&
      missionMessage === ""
    ) {
      return (
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
    }
    if (gameOver || missionMessage) {
      const isWin = result === "win";
      return (
        <div
          className="relative flex flex-row items-center justify-center gap-4 text-center text-3xl font-bold text-amber-700 animate-pulse font-cafe24"
          style={{ transform: "translateY(-20px)" }}
        >
          <div>{missionMessage}</div>
          {!isWin && (
            <button
              onClick={startGame}
              className="relative inline-block text-black rounded-lg text-xl"
            >
              <img src={startBtn} alt="버튼" className="w-48 mx-auto" />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-3xl mb-2">
                재도전
              </span>
            </button>
          )}
        </div>
      );
    }
    return null;
  }, [isPlaying, countdown, gameOver, missionMessage, result]);

  useEffect(() => {
    if (setStatusContent) {
      setStatusContent(statusContent);
    }
  }, [statusContent, setStatusContent]);

  // [4] 언마운트 시 상태 UI 정리
  useEffect(() => {
    return () => {
      setStatusContent?.(null);
    };
  }, [setStatusContent]);

  // 최종 렌더: EatCookie와 동일한 구조 (숨긴 video, 캔버스, 모달, 카운트다운)
  return (
    <>
      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      {/* 내 손(플레이어) vs 마녀 제스처 */}
      <div className="absolute top-4 left-4 text-white text-3xl font-semibold bg-black/50 px-6 py-4 rounded-xl space-y-1 font-cafe24">
        <div>
          🧙 마녀: {witchGesture ? gestureToEmoji[witchGesture] : "..."}
        </div>
        <div>
          🧒 나: {playerGesture ? gestureToEmoji[playerGesture] : "..."}
        </div>
      </div>

    
    </>
  );
};

export default RockScissorsPaper;
