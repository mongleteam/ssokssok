import React, { useRef, useEffect, useState, useMemo } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { captureCompositeImage } from "../../utils/captureCompositeImage";
import { useHandGesture } from "../../hooks/useHandGesture";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import startBtn from "../../assets/images/btn_green.png";
import { judgeRPS } from "../../utils/judgeRPS";
import { getRandomWitchHand } from "../../utils/getRandomWitchHand";
import CustomAlert from "../CustomAlert";


// 가위바위보 이모지 매핑
const gestureToEmoji = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

const RockScissorsPaperMission = ({ onComplete, setStatusContent }) => {
  const videoRef = useRef(null);
  const missionRef = useRef(null);

  // 기본 게임 진행 상태
  const [isPlaying, setIsPlaying] = useState(false); // 게임 중 여부
  const [countdown, setCountdown] = useState(null); // 카운트다운
  const [gameOver, setGameOver] = useState(false); // 게임 종료 여부
  const [missionMessage, setMissionMessage] = useState(""); // 결과 메시지
  const [noHandDetected, setNoHandDetected] = useState(false);
  const [initialWitchGesture, setInitialWitchGesture] = useState(null);

  // 이미 결과 처리했는지 체크 (한 번만 처리)
  const handledRef = useRef(false);

  // MediaPipe/캡처 관련 훅
  const {
    handLandmarks,
    previewUrl,
    showModal,
    countdown: captureCountdown,
    setShowModal,
    handleSave,
    alertMessage,        // ⬅️ 추가
    setAlertMessage,
  } = useTrackingCore(videoRef, captureCompositeImage);

  // 가위바위보 제스처 훅
  const {
    playerGesture,
    witchGesture,
    result,
    resetGesture,
    playerGestureRef,
    witchGestureRef,
    setResult,
  } = useHandGesture(handLandmarks, isPlaying);
  const handLandmarksRef = useRef(null);

  useEffect(() => {
    handLandmarksRef.current = handLandmarks;
  }, [handLandmarks]);
  // [1] 결과 판정: 한 번만 처리
  // useEffect(() => {
  //   // 아직 게임오버 아니거나, 결과가 없거나, 이미 처리했다면 무시
  //   if (!gameOver || !result || result === "Waiting..." || handledRef.current) {
  //     return;
  //   }
  //   handledRef.current = true;

  //   // 결과에 따라 메시지 세팅
  //   if (result === "win") {
  //     setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
  //     onComplete?.();
  //   } else if (result === "lose") {
  //     setMissionMessage("😵 패배 - 다시 도전해보세요!");
  //   } else {
  //     // 무승부
  //     setMissionMessage("😐 무승부 - 다시 도전해보세요!");
  //   }
  // }, [result, gameOver, onComplete]);

  // [2] "도전" 버튼 → 게임 시작
  const startGame = () => {
    resetGesture();
    handledRef.current = false;
    setGameOver(false);
    setIsPlaying(true);
    setNoHandDetected(false);
    setMissionMessage("");
    setCountdown(3);
    const firstWitch = getRandomWitchHand();
    setInitialWitchGesture(firstWitch);
    let count = 3;
    let handDetected = false;

    const checkHandInterval = setInterval(() => {
      const current = handLandmarksRef.current;
      if (current && current.length > 0) {
        handDetected = true;
      }
    }, 200);

    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        clearInterval(checkHandInterval);
        setCountdown(null);
        setTimeout(() => {
          setIsPlaying(false);
          setGameOver(true);

          // 손이 전혀 인식되지 않았다면 바로 "손 미인식" 처리
          if (!handDetected) {
            setNoHandDetected(true);
            setMissionMessage("🙅 손이 인식되지 않았습니다.");
            return;
          }

          // === 최종 판단 ===
          // useHandGesture 훅 내부에서 playerGestureRef와 witchGestureRef로 최신 값을 보관하도록 수정한 후 사용합니다.
          const finalWitchGesture = firstWitch;
          const finalPlayerGesture = playerGestureRef.current;
          const finalResult = judgeRPS(finalPlayerGesture, finalWitchGesture);

          setResult(finalResult);

          // 결과에 따라 UI 업데이트
          if (finalResult === "win") {
            setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
            onComplete?.();
          } else if (finalResult === "lose") {
            setMissionMessage("😵 패배 - 다시 도전해보세요!");
          } else {
            setMissionMessage("😐 무승부 - 다시 도전해보세요!");
          }
        }, 1000);
      }
    }, 1000);
  };

  // [3] 상태별 UI (부모에 표시할 것)
  // [1] 상태별 UI 정의 (동일)
  const statusContent = useMemo(() => {
    if (isPlaying && countdown !== null) {
      return (
        <div className="text-5xl text-center font-bold animate-bounce font-cafe24 mt-2">
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
            <img src={startBtn} alt="도전 버튼" className="w-40 mx-auto" />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl mb-2">
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
          className="relative flex flex-row items-center justify-center gap-4 text-center text-2xl font-bold text-amber-700 animate-pulse font-cafe24 mt-3"
          style={{ transform: "translateY(-20px)" }}
        >
          <div>{missionMessage}</div>
          {!isWin && (
            <button
              onClick={startGame}
              className="relative inline-block text-black rounded-lg text-xl"
            >
              <img src={startBtn} alt="버튼" className="w-40 mx-auto" />
              <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl mb-2">
                재도전
              </span>
            </button>
          )}
        </div>
      );
    }
    if (noHandDetected) {
      return (
        <div
          className="relative flex flex-row items-center justify-center gap-4 text-center text-2xl font-bold text-red-600 animate-pulse font-cafe24"
          style={{ transform: "translateY(-20px)" }}
        >
          <div>🙅 손이 인식되지 않았습니다!</div>
          <button
            onClick={startGame}
            className="relative inline-block text-black rounded-lg text-xl"
          >
            <img src={startBtn} alt="버튼" className="w-40 mx-auto" />
            <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl mb-2">
              재도전
            </span>
          </button>
        </div>
      );
    }

    return <div style={{ minHeight: "40px" }}></div>;
  }, [isPlaying, countdown, gameOver, missionMessage, result]);

  // [2] 무조건 setStatusContent 호출 (최초 렌더 포함)
  useEffect(() => {
    if (setStatusContent) {
      setStatusContent(statusContent);
    }
  }, [statusContent, setStatusContent]);

  // [4] 이전 UI와 비교해 바뀌면 setStatusContent 호출 (무한 루프 방지)
  const prevStatusRef = useRef(null);
  useEffect(() => {
    if (setStatusContent && prevStatusRef.current !== statusContent) {
      prevStatusRef.current = statusContent;
      setStatusContent(statusContent);
    }
  }, [statusContent, setStatusContent]);
  const displayWitch = isPlaying
    ? witchGesture // 훅에서 100ms마다 바뀌는 실시간 값
    : initialWitchGesture; // 판정에 쓸 최종 값

  // 플레이어는 항상 훅의 playerGestureRef.current
  const displayPlayer = playerGestureRef.current;

  // [5] 언마운트 시 정리
  useEffect(() => {
    return () => {
      setStatusContent?.(null);
    };
  }, [setStatusContent]);

  // [6] 실제 화면(웹캠 + UI)
  return (
    <div
      id="capture-container"
      ref={missionRef}
      className="relative w-[48rem] aspect-video torn-effect mb-3 overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* 내 손(플레이어) vs 마녀 제스처 */}
      <div className="absolute top-4 left-4 text-white text-3xl font-semibold bg-black/50 px-6 py-4 rounded-xl space-y-1 font-cafe24">
        <div>
          🧙 마녀: {displayWitch ? gestureToEmoji[displayWitch] : "❓"}
        </div>
        <div>
          🧒 나: {displayPlayer ? gestureToEmoji[displayPlayer] : "..."}
        </div>
      </div>

      {/* 캡처 카운트다운 오버레이 */}
      {captureCountdown !== null && (
        <CountdownOverlay count={captureCountdown} />
      )}

      {/* 캡처 미리보기/모달 */}
      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />

      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
};

export default RockScissorsPaperMission;
