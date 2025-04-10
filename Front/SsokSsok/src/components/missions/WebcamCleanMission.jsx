import React, { useEffect, useRef, useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { captureWithVideoOverlay } from "../../utils/captureWithVideoOverlay";
import { useHandPose } from "../../hooks/useHandPose";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import CustomAlert from "../CustomAlert";



const WebcamCleanMission = ({
  onComplete,
  setStatusContent,
  missionProps,
  assets,
}) => {
  const videoRef = useRef(null);
  const broomRef = useRef(null);
  const missionRef = useRef(null);
  const [motionCount, setMotionCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [dusts, setDusts] = useState([]);

  const {
    handLandmarks,
    showModal,
    previewUrl,
    handleSave,
    countdown,
    setShowModal,
    alertMessage,        // ⬅️ 추가
    setAlertMessage,
  } = useTrackingCore(videoRef, 1, captureWithVideoOverlay, {
    useHands: true,
    useHolistic: false,
  });

  const { isHandOpen, getHandCenter } = useHandPose(handLandmarks);

  const broomImg = assets[missionProps.instructionImages?.[0]];
  const dustImg = assets[missionProps.instructionImages?.[3]]; // 사용할 먼지 이미지 하나 (ex: dustImg3)

  const motionRef = useRef({ startX: null });
  const countRef = useRef(0);

  // ✅ 먼지 3개 랜덤 위치에 배치 (처음 1번만)
  useEffect(() => {
    if (!dustImg) return;
    if (dusts.length > 0) return;
  
    const MIN_DISTANCE = 30; // 퍼센트 기준 최소 거리 (예: 25%)
  
    const newDusts = [];
    let tries = 0;
  
    while (newDusts.length < 3 && tries < 100) {
      const x = Math.random() * 70 + 10; // 10% ~ 80%
      const y = Math.random() * 60 + 20; // 20% ~ 80%
      const tooClose = newDusts.some((d) => {
        const dx = d.x - x;
        const dy = d.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < MIN_DISTANCE;
      });
      if (!tooClose) {
        newDusts.push({
          id: newDusts.length,
          img: dustImg,
          x,
          y,
        });
      }
      tries++;
    }
  
    setDusts(newDusts);
  }, [dustImg, dusts.length]);

  // 💨 좌/우 끝으로 손 흔들면 청소 카운트
  useEffect(() => {
    if (!handLandmarks || countRef.current >= 3 || !isHandOpen) return;

    const wrist = handLandmarks[0];
    if (!wrist) return;

    const currentX = wrist.x;
    const prevX = motionRef.current.startX;

    if (prevX === null) {
      motionRef.current.startX = currentX;
      return;
    }

    const movedFromLeftToRight = prevX < 0.3 && currentX > 0.7;
    const movedFromRightToLeft = prevX > 0.7 && currentX < 0.3;

    if (movedFromLeftToRight || movedFromRightToLeft) {
      countRef.current += 1;
      setMotionCount(countRef.current);
      motionRef.current.startX = null;
    }
  }, [handLandmarks, isHandOpen]);

  // 🧹 손 위에 빗자루 따라다니기
  useEffect(() => {
    let animationId;

    const updatePosition = () => {
      if (broomRef.current && getHandCenter) {
        broomRef.current.style.left = `${(1 - getHandCenter.x) * 100}%`;
        broomRef.current.style.top = `${getHandCenter.y * 100 - 10}%`;
      }
      animationId = requestAnimationFrame(updatePosition);
    };

    animationId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationId);
  }, [getHandCenter]);

  // ✅ 미션 완료 메시지 + onComplete
  useEffect(() => {
    if (motionCount >= 3 && !successMessage) {
      setSuccessMessage("✅ 청소 완료! 다음 페이지로 이동하세요.");
      onComplete?.();
    }
  }, [motionCount, successMessage, onComplete]);

  // 💬 상태 UI 업데이트
  useEffect(() => {
    if (!setStatusContent) return;
    const ui = successMessage ? (
      <div className="text-2xl font-cafe24 font-bold text-green-700 animate-pulse text-center">
        {successMessage}
      </div>
    ) : (
      <div className="text-3xl font-cafe24 text-center font-bold text-blue-700 animate-bounce">
        {motionCount} / 3
      </div>
    );
    setStatusContent(ui);
  }, [motionCount, successMessage]);

  return (
    <div
      ref={missionRef}
      id="capture-container"
      className="relative w-[48rem] aspect-video torn-effect mb-3 overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* 💨 먼지 이미지 3개 중 motionCount만큼 사라짐 */}
      {dusts
        .filter((_, index) => index >= motionCount)
        .map((dust) => (
          <img
            key={dust.id}
            src={dust.img}
            alt="dust"
            className="absolute w-[10rem] object-contain z-10 pointer-events-none"
            style={{
              left: `${dust.x}%`,
              top: `${dust.y}%`,
            }}
          />
        ))}

      {/* 🧹 빗자루 이미지 */}
      {broomImg && getHandCenter && isHandOpen && (
        <img
          ref={broomRef}
          src={broomImg}
          alt="broom"
          className="absolute w-40 h-40 pointer-events-none z-20"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* ⏱️ 카운트다운 */}
      {countdown !== null && <CountdownOverlay count={countdown} />}

      {/* 📸 캡처 모달 */}
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

export default WebcamCleanMission;
