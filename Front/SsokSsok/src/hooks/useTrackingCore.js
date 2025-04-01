// ✅ hooks/useTrackingCore.js
import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { captureCompositeImage } from "../utils/captureCompositeImage";
import { sendThumbImage } from "../apis/bookStartApi";

export const useTrackingCore = (videoRef, fairytalePk = 1) => {
  const [handLandmarks, setHandLandmarks] = useState(null);
  const [faceLandmarks, setFaceLandmarks] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const captureTriggered = useRef(false);
  const cameraRef = useRef(null);
  const thumbHoldStart = useRef(null);

  const startCountdownAndCapture = async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);
    await new Promise((r) => setTimeout(r, 500));

    const { url } = await captureCompositeImage("capture-container");
    setPreviewUrl(url);
    setShowModal(true);
    captureTriggered.current = false;
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
    const face = new Holistic({ locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}` });

    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.8, minTrackingConfidence: 0.7 });
    face.setOptions({ modelComplexity: 1, minDetectionConfidence: 0.8, minTrackingConfidence: 0.7 });

    hands.onResults((res) => {
      const landmarks = res.multiHandLandmarks?.[0] || null;
      setHandLandmarks((prev) => {
        return JSON.stringify(prev) !== JSON.stringify(landmarks) ? landmarks : prev;
      });

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

    face.onResults((res) => {
      setFaceLandmarks(res.multiFaceLandmarks?.[0] || null);
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
        await face.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();
    return () => cameraRef.current.stop();
  }, [videoRef]);

  const handleSave = async () => {
    const res = await fetch(previewUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "thumb-capture.png");
    formData.append("fairytalePk", fairytalePk);
    await sendThumbImage(formData);
    alert("✅ 저장 완료!");
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
  };
};
