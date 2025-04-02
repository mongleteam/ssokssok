// src/hooks/useHandGesture.js
import { useEffect, useState, useCallback } from "react";
import { getHandGesture } from "../utils/gestureDetector";
import { getRandomWitchHand } from "../utils/getRandomWitchHand";
import { judgeRPS } from "../utils/judgeRPS";

export const useHandGesture = (handLandmarks, isActive = false) => {
  const [playerGesture, setPlayerGesture] = useState("None");
  const [witchGesture, setWitchGesture] = useState("?");
  const [result, setResult] = useState("Waiting...");

  useEffect(() => {
    if (!isActive) return;
    if (handLandmarks) {
      const gesture = getHandGesture(handLandmarks);
      if (gesture && ["rock", "paper", "scissors"].includes(gesture)) {
        const randomWitch = getRandomWitchHand();
        setPlayerGesture(gesture);
        setWitchGesture(randomWitch);
        setResult(judgeRPS(gesture, randomWitch));
      }
    }
  }, [handLandmarks, isActive]);

  // ✅ 외부에서 초기화할 수 있도록 함수 제공
  const resetGesture = useCallback(() => {
    setPlayerGesture("None");
    setWitchGesture("?");
    setResult("Waiting...");
  }, []);

  return {
    playerGesture,
    witchGesture,
    result,
    resetGesture, // ✅ 반환
  };
};
