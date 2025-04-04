// ✅ missions/EatCookieMission.jsx
import React, { useRef, useEffect, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { useMouthTracker } from "../../../hooks/useMouthTracker";
import CountdownOverlay from "../../webcam/captureCompositeImage";
import PhotoCaptureModal from "../../webcam/PhotoCaptureModal";

const EatCookie = ({
  onSuccess, // 미션 성공 시 호출되는 콜백
  setStatusContent, // 상태 UI 업데이트 함수
  missionData, // 미션 관련 데이터
  assets,
  publisher, // VideoWithOverlay에서 전달한 publisher (stream 제공)
  roomId, // 필요 시 사용 (예: 소켓 통신)
  userName, // 필요 시 사용
  from, // 필요 시 사용
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [missionMessage, setMissionMessage] = useState("");
  const [faceLandmarks, setFaceLandmarks] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [countdown, setCountdown] = useState(null); // 필요에 따라 카운트다운 관리

  const soundSrc = missionData.soundEffect?.[0];
  const MAX_COOKIE = 3;
  const cookieImages = missionData.instructionImages;
  const currentCookieImage =
    cookieImages[count] || cookieImages[cookieImages.length - 1];

  // Mediapipe Holistic 초기화 및 카메라 설정 (publisher 스트림 사용)
  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults((results) => {
      // 얼굴 랜드마크 업데이트
      setFaceLandmarks(results.faceLandmarks);
    });

    const setupCamera = async () => {
      if (videoRef.current && publisher?.stream) {
        const mediaStream = publisher.stream.getMediaStream();
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              await holistic.send({ image: videoRef.current });
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
      holistic.close();
    };
  }, [publisher]);

  // useMouthTracker로 입 열림 여부 감지
  const { mouthOpen } = useMouthTracker(faceLandmarks);
  const prevMouthOpenLocal = useRef(null);

  useEffect(() => {
    console.log("[COOKIE] mouthOpen:", mouthOpen);
    if (prevMouthOpenLocal.current === null) {
      prevMouthOpenLocal.current = mouthOpen;
      return;
    }
    // 입이 열렸다가 닫히면 쿠키 먹은 것으로 처리
    if (prevMouthOpenLocal.current === true && mouthOpen === false) {
      console.log("[COOKIE] 입이 닫혔어요 → 쿠키 먹기!");
      if (soundSrc && assets[soundSrc]) {
        const audio = new Audio(assets[soundSrc]);
        audio.play().catch(() => {});
      }
      setCount((prev) => {
        const newCount = prev + 1;
        console.log("[COOKIE] 쿠키 먹은 개수:", newCount);
        if (newCount >= MAX_COOKIE) setSuccess(true);
        return newCount;
      });
    }
    prevMouthOpenLocal.current = mouthOpen;
  }, [mouthOpen, soundSrc, assets]);

  // 쿠키를 모두 먹으면 성공 처리
  useEffect(() => {
    if (count >= MAX_COOKIE) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onSuccess?.();
    }
   
  }, [count, onSuccess]);

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
  }, [count, missionMessage, setStatusContent]);

  // CollectStoneOverlay와 동일한 구조: 숨긴 비디오 + 전체를 덮는 캔버스 + 오버레이 이미지
  return (
    <>
      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      {!success && (
        <img
          src={assets[currentCookieImage]}
          alt="cookie"
          className="absolute w-36 h-36 z-20"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={() => {}}
        onClose={() => setShowModal(false)}
      />
      {countdown !== null && <CountdownOverlay count={countdown} />}
    </>
  );
};

export default EatCookie;
