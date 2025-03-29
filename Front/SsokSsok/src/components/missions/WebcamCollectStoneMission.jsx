import React, { useEffect, useRef, useState } from "react";
import * as handpose from "@mediapipe/hands"; // or custom hook
import {useHandPose} from "../../hooks/useHandPose"; // 네가 이미 만든 훅이 있다면 그거 사용


const WebcamCollectStoneMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const [collected, setCollected] = useState(0);
  const [stones, setStones] = useState([]);

  const targetImage = missionProps.instructionImages?.[0]; // 조약돌 이미지
  const soundSrc = missionProps.soundEffect?.[0];
  const MAX_STONES = 5;

  // 손 위치 가져오기
  const { handPosition, isGrabbing } = useHandPose(videoRef);

  // 웹캠 설정
  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("웹캠 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  // 조약돌 랜덤 배치
  useEffect(() => {
    if (!assets[targetImage]) return;

    const newStones = Array.from({ length: MAX_STONES }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 화면 % 기준
      y: Math.random() * 60 + 20,
      collected: false,
    }));
    setStones(newStones);
  }, [assets, targetImage]);

  // 조약돌 수집 체크
  useEffect(() => {
    if (!handPosition || !isGrabbing) return;

    setStones((prev) =>
      prev.map((stone) => {
        if (
          !stone.collected &&
          Math.abs(stone.x - handPosition.x) < 10 &&
          Math.abs(stone.y - handPosition.y) < 10
        ) {
          if (soundSrc) collectSound(assets[soundSrc]);
          setCollected((c) => c + 1);
          return { ...stone, collected: true };
        }
        return stone;
      })
    );
  }, [handPosition, isGrabbing, soundSrc, assets]);

  useEffect(() => {
    if (collected >= MAX_STONES) {
      onComplete?.();
    }
  }, [collected, onComplete]);

  // 상태 UI 넘기기
  useEffect(() => {
    if (!setStatusContent) return;
    const ui = (
      <div className="text-3xl text-center font-bold text-stone-900">
        {collected} / {MAX_STONES}
      </div>
    );
    setStatusContent(ui);
  }, [collected]);

  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
      {stones.map(
        (stone) =>
          !stone.collected && (
            <img
              key={stone.id}
              src={assets[targetImage]}
              alt="stone"
              className="absolute w-16 h-16"
              style={{ left: `${stone.x}%`, top: `${stone.y}%` }}
            />
          )
      )}
    </div>
  );
};

export default WebcamCollectStoneMission;
