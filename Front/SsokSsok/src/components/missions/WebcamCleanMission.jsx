import React, { useEffect, useRef, useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { captureWithVideoOverlay } from "../../utils/captureWithVideoOverlay";
import { useHandPose } from "../../hooks/useHandPose";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";

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

  const {
    handLandmarks,
    showModal,
    previewUrl,
    handleSave,
    countdown,
    setShowModal,
  } = useTrackingCore(videoRef, 1, captureWithVideoOverlay, {
    useHands: true,
    useHolistic: false,
  });

  const { isHandOpen, getHandCenter } = useHandPose(handLandmarks);

  const broomImg = assets[missionProps.instructionImages?.[0]];
  const dustImg1 = assets[missionProps.instructionImages?.[1]];
  const dustImg2 = assets[missionProps.instructionImages?.[2]];
  const dustImg3 = assets[missionProps.instructionImages?.[3]];

  const motionRef = useRef({ startX: null });
  const countRef = useRef(0);


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

  // 🧹 손 위에 빗자루 따라다니기 (빠르게)
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

  // 먼지 이미지 단계별 표시
  const renderDust = () => {
    if (motionCount === 0) return dustImg3;
    if (motionCount === 1) return dustImg2;
    if (motionCount === 2) return dustImg1;
    return null;
  };

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

      {/* 💨 먼지 이미지 */}
      {renderDust() && (
        <img
          src={renderDust()}
          alt="dust"
          className="absolute top-20 right-0 w-[20rem] object-cover z-10 pointer-events-none"
        />
      )}

      {/* 🧹 손이 열려 있고 좌표 있을 때만 빗자루 표시 */}
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
    </div>
  );
};

export default WebcamCleanMission;
