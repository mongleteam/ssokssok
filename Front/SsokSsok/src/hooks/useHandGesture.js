// src/hooks/useHandGesture.js
import { useEffect, useState, useCallback } from "react";
import { getHandGesture } from "../utils/gestureDetector";
import { getRandomWitchHand } from "../utils/getRandomWitchHand";
import { judgeRPS } from "../utils/judgeRPS";

export const useHandGesture = (handLandmarks, isActive = false) => {
  const [playerGesture, setPlayerGesture] = useState("None");
  const [witchGesture, setWitchGesture] = useState("?");
  const [result, setResult] = useState("Waiting...");

  // 마녀 손 계속 바꾸기
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setWitchGesture(getRandomWitchHand());
    }, 100); // 

    return () => clearInterval(interval);
  }, [isActive]);

  // 내 손 제스처 인식
  useEffect(() => {
    if (!isActive || !handLandmarks) return;
    const gesture = getHandGesture(handLandmarks);
    if (gesture && ["rock", "paper", "scissors"].includes(gesture)) {
      setPlayerGesture(gesture);
      setResult(judgeRPS(gesture, witchGesture));
    }
  }, [handLandmarks, isActive, witchGesture]);

  // 외부에서 초기화할 수 있도록 함수 제공
  const resetGesture = useCallback(() => {
    setPlayerGesture("None");
    setWitchGesture("?");
    setResult("Waiting...");
  }, []);

  return {
    playerGesture,
    witchGesture,
    result,
    resetGesture,
  };
};