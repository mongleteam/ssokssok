// ✅ missions/EatCookieMission.jsx
import React, { useRef, useEffect, useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { captureWithVideoOverlay } from "../../utils/captureWithVideoOverlay";
import { useMouthTracker } from "../../hooks/useMouthTracker";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import CustomAlert from "../CustomAlert";


const EatCookieMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const missionRef = useRef(null);

  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [missionMessage, setMissionMessage] = useState("");

  const soundSrc = missionProps.soundEffect?.[0];
  const MAX_COOKIE = 3;
  const cookieImages = missionProps.instructionImages;
  const currentCookieImage = cookieImages[count] || cookieImages[cookieImages.length - 1];

  const {
    handLandmarks,
    faceLandmarks,
    previewUrl,
    showModal,
    countdown,
    setShowModal,
    handleSave,
    alertMessage,        // ⬅️ 추가
    setAlertMessage,
  } = useTrackingCore(videoRef, 1, captureWithVideoOverlay);

  const { mouthOpen } = useMouthTracker(faceLandmarks);
  const prevMouthOpenLocal = useRef(null);

  useEffect(() => {
    if(success) return;

    if (prevMouthOpenLocal.current === null) {
      prevMouthOpenLocal.current = mouthOpen;
      return;
    }
    if (prevMouthOpenLocal.current === true && mouthOpen === false) {
      if (soundSrc && assets[soundSrc]) {
        const audio = new Audio(assets[soundSrc]);
        audio.play().catch(() => {});
      }
      setCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= MAX_COOKIE) setSuccess(true);
        return newCount;
      });
    }
    prevMouthOpenLocal.current = mouthOpen;
  }, [mouthOpen, soundSrc, assets]);

  useEffect(() => {
    if (count >= MAX_COOKIE) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    }
  }, [count, onComplete]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = missionMessage ? (
      <div className="text-2xl text-center font-bold text-green-700 animate-pulse font-cafe24">
        {missionMessage}
      </div>
    ) : (
      <div className="text-4xl font-cafe24 text-center font-bold text-stone-900">
        {count} / {MAX_COOKIE}
      </div>
    );
    setStatusContent(ui);
  }, [count, missionMessage]);

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
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {countdown !== null && <CountdownOverlay count={countdown} />}

      {/* 쿠키 이미지 오버레이 */}
      {!success && (
        <img
          src={assets[currentCookieImage]}
          alt="cookie"
          className="absolute w-58 h-48 transition-opacity duration-500 ease-in-out"
          style={{
            top: "80%",
            left: "50%",
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

      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
};

export default EatCookieMission;
