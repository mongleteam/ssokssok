// ✅ hooks/useTrackingCore.js
import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { captureCompositeImage } from "../utils/captureCompositeImage";
import { sendThumbImage } from "../apis/bookStartApi";
import { playShutterSound } from "../utils/playShutterSound";
import CustomAlert from "../components/CustomAlert";

export const useTrackingCore = (videoRef, fairytalePk = 1, captureFn = captureCompositeImage, options = {
  useHands : true, useHolistic: true }
) => {
  const [handLandmarks, setHandLandmarks] = useState(null);
  const [faceLandmarks, setFaceLandmarks] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const {useHands = true, useHolistic = true} = options;
  const [alertMessage, setAlertMessage] = useState(null);

  const captureTriggered = useRef(false);  // 캡처 중복 방지
  const cameraRef = useRef(null);   // Mediapipe 카메라 인스턴스
  const thumbHoldStart = useRef(null);  // 엄지 유지 시작 시간
  const holisticRef = useRef(null);
  const handsRef = useRef(null);
  const lastLandmarksRef = useRef(null);        // 이전 프레임의 손 좌표 저장

  // 3초 카운트다운 후 캡처 및 미리보기 띄우기기
  const startCountdownAndCapture = async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);
    await new Promise((r) => setTimeout(r, 500));

    playShutterSound(); // 🎯 그냥 한 번 재생만

    const { url } = await captureFn("capture-container");
    setPreviewUrl(url);
    setShowModal(true);
    captureTriggered.current = false;
  };


  useEffect(() => {
    if (!videoRef.current || cameraRef.current) return;

    if (useHands) {
      const hands = new Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.7
      });
      hands.onResults((res) => {
        const landmarks = res.multiHandLandmarks?.[0] || null;
        const changed = JSON.stringify(lastLandmarksRef.current) !== JSON.stringify(landmarks);
        if (changed) {
          lastLandmarksRef.current = landmarks;
          setHandLandmarks(landmarks);
        }

        const thumb = landmarks?.[4];
        const index = landmarks?.[8];

        if (!thumb || !index) {
          thumbHoldStart.current = null;
          return;
        }

        const isThumbUp = thumb.y < index.y - 0.1;

        if (isThumbUp) {
          if (!thumbHoldStart.current) {
            thumbHoldStart.current = Date.now();
          } else {
            const elapsed = Date.now() - thumbHoldStart.current;
            if (elapsed >= 2000 && !captureTriggered.current) {
              captureTriggered.current = true;
              console.log("👍 엄지 2초 유지됨! 캡처 시작");
              startCountdownAndCapture();
            }
          }
        } else {
          thumbHoldStart.current = null;
        }
      });
      handsRef.current = hands;
    }

    if (useHolistic) {
      const holistic = new Holistic({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}` });
      holistic.setOptions({
        modelComplexity: 1,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      holistic.onResults((res) => {
        setFaceLandmarks(res.faceLandmarks || null);
      });
      holisticRef.current = holistic;
    }

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current?.readyState >= 2) {
          if (useHands && handsRef.current) await handsRef.current.send({ image: videoRef.current });
          if (useHolistic && holisticRef.current) await holisticRef.current.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();
    return () => cameraRef.current.stop();
  }, []);


  const handleSave = async () => {
    const res = await fetch(previewUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "thumb-capture.png");
    formData.append("fairytalePk", fairytalePk);
    await sendThumbImage(formData);
    setAlertMessage("🌟 방금 찍은 사진이 나만의 앨범에 저장됐어요!");
    setShowModal(false);
    setPreviewUrl(null);
  };

  return {
    handLandmarks,
    faceLandmarks,
    previewUrl,
    showModal,
    countdown,
    setShowModal,
    handleSave,
    alertMessage,          
    setAlertMessage,
  };
};
