import React, { useEffect, useRef, useState } from "react";
import { useHandPose } from "../../hooks/useHandPose";

const WebcamCollectStoneMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const [collected, setCollected] = useState(0);
  const [stones, setStones] = useState([]);
  const [hoveredStoneId, setHoveredStoneId] = useState(null);
  const [lastHoveredStoneId, setLastHoveredStoneId] = useState(null);
  const [missionMessage, setMissionMessage] = useState("");

  const targetImage = missionProps.instructionImages?.[0];
  const soundSrc = missionProps.soundEffect?.[0];
  const MAX_STONES = 5;

  const { getHandCenter, isHandOpen, isHandClosed } = useHandPose(videoRef);

  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("포트 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  useEffect(() => {
    if (!assets[targetImage]) return;

    const newStones = [];
    const minDistance = 22; // 최소 거리 (percent 기준)

    while (newStones.length < MAX_STONES) {
      const newStone = {
        id: newStones.length,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        collected: false,
      };

      const tooClose = newStones.some(
        (s) =>
          Math.abs(s.x - newStone.x) < minDistance &&
          Math.abs(s.y - newStone.y) < minDistance
      );

      if (!tooClose) newStones.push(newStone);
    }

    setStones(newStones);
  }, [assets, targetImage]);

  useEffect(() => {
    const center = getHandCenter();
    if (!center || !isHandOpen()) {
      setHoveredStoneId(null);
      return;
    }

    const hovered = stones.find(
      (stone) =>
        !stone.collected &&
        Math.abs(stone.x / 100 - (1 - center.x)) < 0.05 &&
        Math.abs(stone.y / 100 - center.y) < 0.05
    );

    if (hovered) {
      setHoveredStoneId(hovered.id);
      setLastHoveredStoneId(hovered.id);
    } else {
      setHoveredStoneId(null);
    }
  }, [stones, getHandCenter, isHandOpen]);

  useEffect(() => {
    const center = getHandCenter();
    if (!center || !isHandClosed() || lastHoveredStoneId === null) return;

    setStones((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((stone) => stone.id === lastHoveredStoneId && !stone.collected);
      if (idx !== -1) {
        if (soundSrc && assets[soundSrc]) {
          const audio = new Audio(assets[soundSrc]);
          audio.play().catch(() => {});
        }
        updated[idx].collected = true;
        setCollected((c) => c + 1);
        setLastHoveredStoneId(null);
      }
      return updated;
    });
  }, [lastHoveredStoneId, isHandClosed, getHandCenter, soundSrc, assets]);

  useEffect(() => {
    if (collected >= MAX_STONES) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    }
  }, [collected, onComplete]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = missionMessage ? (
      <div className="text-3xl text-center font-bold text-green-700 animate-pulse">
        {missionMessage}
      </div>
    ) : (
      <div className="text-5xl font-cafe24 text-center font-bold text-stone-900">
        {collected} / {MAX_STONES}
      </div>
    );
    setStatusContent(ui);
  }, [collected, missionMessage]);

  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
      <div id="hand-debug-layer" className="absolute inset-0 pointer-events-none z-50" />
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
