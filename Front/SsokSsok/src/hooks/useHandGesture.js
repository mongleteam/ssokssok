// useHandGesture.js (예시)
import { useEffect, useState, useCallback, useRef } from "react";
import { getHandGesture } from "../utils/gestureDetector";
import { getRandomWitchHand } from "../utils/getRandomWitchHand";

export const useHandGesture = (handLandmarks, isActive = false) => {
  const [playerGesture, setPlayerGesture] = useState("None");
  const [witchGesture, setWitchGesture] = useState("?");
  const [result, setResult] = useState("Waiting...");
  

  // 최신 제스처 값을 보관하는 Ref
  const playerGestureRef = useRef("None");
  const witchGestureRef = useRef("?");

  // 마녀 손 지속 업데이트
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const newWitchGesture = getRandomWitchHand();
      setWitchGesture(newWitchGesture);
      witchGestureRef.current = newWitchGesture;
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  // 플레이어 제스처 인식 및 Ref 업데이트
  useEffect(() => {
    if (!isActive || !handLandmarks) return;
    const gesture = getHandGesture(handLandmarks);
    if (gesture && ["rock", "paper", "scissors"].includes(gesture)) {
      setPlayerGesture(gesture);
      playerGestureRef.current = gesture;
      // 실시간 판정을 원한다면 judgeRPS()를 이곳에서 호출할 수 있지만,
      // 최종 판정을 위해서는 카운트다운 종료 시점에 한 번만 호출하도록 하고 useEffect에서는 호출하지 않습니다.
    }
  }, [handLandmarks, isActive]);

  // 외부에서 초기화할 함수
  const resetGesture = useCallback(() => {
    setPlayerGesture("None");
    setWitchGesture("?");
    playerGestureRef.current = "None";
    witchGestureRef.current = "?";
    setResult("Waiting...");
  }, []);

  return {
    playerGesture,
    witchGesture,
    result,
    resetGesture,
    playerGestureRef, // 최종 판정에 사용할 수 있도록 Ref 반환
    witchGestureRef,
    setResult,
    setWitchGesture
  };
};
