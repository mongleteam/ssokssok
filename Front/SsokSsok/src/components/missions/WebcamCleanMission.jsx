import React, { useEffect, useRef, useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { useHandPose } from "../../hooks/useHandPose";
import CountdownOverlay from "../webcam/captureCompositeImage";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";

const WebcamCleanMission = ({
  onComplete,
  setStatusContent,
  missionProps,
  assets,
}) => {
  const videoRef = useRef(null);
  const missionRef = useRef(null);
  const [motionCount, setMotionCount] = useState(0);
  const {
    handLandmarks,
    showModal,
    previewUrl,
    handleSave,
    countdown,
    setShowModal,
  } = useTrackingCore(videoRef, 1);

  const { getHandCenter } = useHandPose(handLandmarks);
  const broomImg = assets[missionProps.instructionImages?.[0]];

  // ✅ 먼지 이미지 3단계 추가
  const dustImg1 = assets[missionProps.instructionImages?.[1]];
  const dustImg2 = assets[missionProps.instructionImages?.[2]];
  const dustImg3 = assets[missionProps.instructionImages?.[3]];

  const motionRef = useRef({
    startX: null,
    movedLeft: false,
    movedRight: false,
  });
  const countRef = useRef(0);

  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  useEffect(() => {
    if (!handLandmarks) return;
    if (countRef.current >= 3) return;

    const wrist = handLandmarks[0];
    if (!wrist) return;

    const currentX = wrist.x;
    const sensitivity = 0.1;

    if (motionRef.current.startX === null) {
      motionRef.current.startX = currentX;
      return;
    }

    const deltaX = currentX - motionRef.current.startX;

    if (deltaX > sensitivity && !motionRef.current.movedRight) {
      motionRef.current.movedRight = true;
      motionRef.current.startX = currentX;
    } else if (deltaX < -sensitivity && !motionRef.current.movedLeft) {
      motionRef.current.movedLeft = true;
      motionRef.current.startX = currentX;
    }

    if (motionRef.current.movedLeft && motionRef.current.movedRight) {
      countRef.current += 1;
      setMotionCount(countRef.current);
      motionRef.current = {
        startX: currentX,
        movedLeft: false,
        movedRight: false,
      };
    }
  }, [handLandmarks]);

  useEffect(() => {
    if (motionCount >= 3) {
      onComplete?.();
    }
  }, [motionCount]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = (
      <div className="text-4xl font-cafe24 text-center font-bold text-blue-700 animate-bounce">
        {motionCount} / 3
      </div>
    );
    setStatusContent(ui);
  }, [motionCount]);

  // 먼지 이미지 렌더링
  const renderDust = () => {
    if (motionCount === 0) return dustImg1;
    if (motionCount === 1) return dustImg2;
    if (motionCount === 2) return dustImg3;
    return null;
  };

  return (
    <div
      ref={missionRef}
      id="capture-container"
      className="relative w-[54rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover scale-x-[-1]"
      />
      {countdown !== null && <CountdownOverlay count={countdown} />}

      {/* 먼지 이미지 */}
      {renderDust() && (
        <img
          src={renderDust()}
          alt="dust"
          className="absolute top-0 left-0 w-full h-full object-cover z-10 pointer-events-none"
        />
      )}

      {/* 손 위에 빗자루 이미지 */}
      {getHandCenter && broomImg && (
        <img
          src={broomImg}
          alt="broom"
          className="absolute w-80 h-80 pointer-events-none z-20"
          style={{
            left: `${(1 - getHandCenter.x) * 100}%`,
            top: `${getHandCenter.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

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
