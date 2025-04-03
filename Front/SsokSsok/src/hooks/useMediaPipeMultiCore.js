// ✅ useMediaPipeMultiCore.js
import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { captureCompositeImage } from "../utils/captureCompositeImage";
import { sendThumbImage } from "../apis/bookStartApi";
import { useMicVolume } from "./useMicVolume";

export const useMediaPipeMultiCore = (videoRef, {
  fairytalePk = 1,
  onMissionSuccess = () => {},
  missionHandler = () => {},
} = {}) => {
  const [handLandmarks, setHandLandmarks] = useState(null);
  const [faceLandmarks, setFaceLandmarks] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const captureTriggered = useRef(false);
  const cameraRef = useRef(null);
  const thumbHoldStart = useRef(null);
  const holisticRef = useRef(null);
  const handsRef = useRef(null);
  const micVolume = useMicVolume();

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

  const checkThumbPose = (landmarks) => {
    const thumb = landmarks?.[4];
    const index = landmarks?.[8];
    return thumb && index && thumb.y < index.y - 0.1;
  };

  useEffect(() => {
    if (!videoRef.current) {
      console.warn("⛔ videoRef가 없습니다");
      return;
    }
    if (cameraRef.current) {
      console.warn("⛔ cameraRef는 이미 존재합니다");
      return;
    }

    const hands = new Hands({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    });
    const holistic = new Holistic({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${f}`,
    });

    handsRef.current = hands;
    holisticRef.current = holistic;

    hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.8, minTrackingConfidence: 0.7 });
    holistic.setOptions({ modelComplexity: 1, refineFaceLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

    hands.onResults((res) => {
      const landmarks = res.multiHandLandmarks?.[0] || null;
      setHandLandmarks((prev) => JSON.stringify(prev) !== JSON.stringify(landmarks) ? landmarks : prev);
      if (checkThumbPose(landmarks)) {
        if (!thumbHoldStart.current) thumbHoldStart.current = Date.now();
        else if (Date.now() - thumbHoldStart.current >= 2000 && !captureTriggered.current) {
          captureTriggered.current = true;
          startCountdownAndCapture();
        }
      } else thumbHoldStart.current = null;
    });

    holistic.onResults((res) => setFaceLandmarks(res.faceLandmarks || null));

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current?.readyState < 1) return;
        await hands.send({ image: videoRef.current });
        await holistic.send({ image: videoRef.current });
        missionHandler({ handLandmarks, faceLandmarks, micVolume, onSuccess: onMissionSuccess });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();

    return () => cameraRef.current.stop();
  }, [videoRef]);

  return { handLandmarks, faceLandmarks, micVolume, countdown, previewUrl, showModal, setShowModal, handleSave };
};
