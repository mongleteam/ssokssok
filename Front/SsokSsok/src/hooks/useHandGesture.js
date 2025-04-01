// src/hooks/useRPSGesture.js
import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { getHandGesture } from "../utils/gestureDetector";
import { getRandomWitchHand } from "../utils/getRandomWitchHand";
import { judgeRPS } from "../utils/judgeRPS";

export const useRPSGesture = (
  videoRef,
  { width = 640, height = 480, isActive = false } = {}
) => {
  const [playerGesture, setPlayerGesture] = useState("None");
  const [witchGesture, setWitchGesture] = useState("?");
  const [result, setResult] = useState("Waiting...");
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  // isActive 값을 실시간으로 읽기 위해 ref 사용
  const isActiveRef = useRef(isActive);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    hands.onResults((results) => {
      // 결과 처리는 오직 isActive가 true일 때만 진행
      if (!isActiveRef.current) return;
      if (
        !results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0
      ) {
        setPlayerGesture("None");
        return;
      }
      const landmarks = results.multiHandLandmarks[0];
      const gesture = getHandGesture(landmarks);
      if (gesture && ["rock", "paper", "scissors"].includes(gesture)) {
        setPlayerGesture(gesture);
        const randomWitch = getRandomWitchHand();
        setWitchGesture(randomWitch);
        setResult(judgeRPS(gesture, randomWitch));
      }
    });
    handsRef.current = hands;

    // 항상 웹캠 스트림 시작 (비디오는 항상 렌더됨)
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width,
      height,
    });
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      camera.start();
    });
    cameraRef.current = camera;
    return () => {
      camera.stop();
    };
  }, [videoRef, width, height]);

  return { playerGesture, witchGesture, result };
};
