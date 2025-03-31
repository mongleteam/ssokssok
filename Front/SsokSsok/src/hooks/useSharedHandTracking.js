// ✅ hooks/useSharedHandTracking.js
import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { sendThumbImage } from "../apis/bookStartApi";

export const useSharedHandTracking = (videoRef, fairytalePk) => {
  const [handLandmarks, setHandLandmarks] = useState(null);
  const [isThumbUp, setIsThumbUp] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const captureTriggered = useRef(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    console.log("✅ useSharedHandTracking 초기화");

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results) => {
      const landmarks = results.multiHandLandmarks?.[0];
      setHandLandmarks(landmarks || null);
      if (!landmarks || captureTriggered.current) return;

      const thumbTip = landmarks[4];
      const indexTip = landmarks[8];

      if (thumbTip.y < indexTip.y - 0.1 && !isThumbUp) {
        console.log("👍 엄지척 인식됨!");
        setIsThumbUp(true);
        captureTriggered.current = true;

        setTimeout(() => {
          captureImage();
        }, 3000);
      }

      if (thumbTip.y >= indexTip.y - 0.1) {
        setIsThumbUp(false);
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 480,
      height: 360,
    });

    cameraRef.current.start();
    return () => cameraRef.current.stop();
  }, [videoRef]);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 480, 360);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowModal(true);
      }
    }, "image/png");
  };

  const handleSave = async () => {
    const res = await fetch(previewUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "thumb-capture.png");
    formData.append("fairytalePk", fairytalePk);
  
    try {
      await sendThumbImage(formData); // ✅ 이 부분
      alert("✅ 저장 완료!");
      setShowModal(false);
      setPreviewUrl(null);
      captureTriggered.current = false;
    } catch (err) {
      console.error("📛 전송 실패:", err);
      alert("전송 중 오류 발생!");
    }
  };

  return { handLandmarks, showModal, previewUrl, handleSave };
};

