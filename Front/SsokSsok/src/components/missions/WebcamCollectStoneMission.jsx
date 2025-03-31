// ✅ components/WebcamCollectStoneMission.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSharedHandTracking } from "../../hooks/useSharedHandTracking";

const WebcamCollectStoneMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const [collected, setCollected] = useState(0);
  const [stones, setStones] = useState([]);
  const [hoveredStoneId, setHoveredStoneId] = useState(null);
  const [lastHoveredStoneId, setLastHoveredStoneId] = useState(null);
  const [missionMessage, setMissionMessage] = useState("");
  const MAX_STONES = 5;

  const { handLandmarks, showModal, previewUrl, handleSave } = useSharedHandTracking(videoRef, 1);

  const getHandCenter = () => {
    if (!handLandmarks) return null;
    const palmPoints = [0, 5, 9, 13, 17];
    const avgX = palmPoints.reduce((sum, i) => sum + handLandmarks[i].x, 0) / palmPoints.length;
    const avgY = palmPoints.reduce((sum, i) => sum + handLandmarks[i].y, 0) / palmPoints.length;
    return { x: avgX, y: avgY };
  };

  const isHandOpen = () => {
    if (!handLandmarks) return false;
    const tips = [8, 12, 16, 20];
    const mcp = [5, 9, 13, 17];
    return tips.every((tip, i) => handLandmarks[tip].y < handLandmarks[mcp[i]].y);
  };

  const isHandClosed = () => {
    if (!handLandmarks) return false;
    const tips = [8, 12, 16, 20];
    const mcp = [5, 9, 13, 17];
    return tips.every((tip, i) => handLandmarks[tip].y > handLandmarks[mcp[i]].y);
  };

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
    const minDistance = 22;
    while (newStones.length < MAX_STONES) {
      const newStone = {
        id: newStones.length,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        collected: false,
      };
      const tooClose = newStones.some(
        (s) => Math.abs(s.x - newStone.x) < minDistance && Math.abs(s.y - newStone.y) < minDistance
      );
      if (!tooClose) newStones.push(newStone);
    }
    setStones(newStones);
  }, [assets]);

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
  }, [stones, handLandmarks]);

  useEffect(() => {
    const center = getHandCenter();
    if (!center || !isHandClosed() || lastHoveredStoneId === null) return;
    setStones((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((s) => s.id === lastHoveredStoneId && !s.collected);
      if (idx !== -1) {
        updated[idx].collected = true;
        setCollected((c) => c + 1);
        setLastHoveredStoneId(null);
      }
      return updated;
    });
  }, [handLandmarks]);

  useEffect(() => {
    if (collected >= MAX_STONES) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    }
  }, [collected]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = missionMessage ? (
      <div className="text-3xl text-center font-bold text-green-700 animate-pulse">{missionMessage}</div>
    ) : (
      <div className="text-5xl font-cafe24 text-center font-bold text-stone-900">{collected} / {MAX_STONES}</div>
    );
    setStatusContent(ui);
  }, [collected, missionMessage]);

  const targetImage = missionProps.instructionImages?.[0];

  return (
    <div className="relative w-[56rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />

      {/* ✅ 캡처 모달 */}
      {showModal && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow z-50">
          <img src={previewUrl} className="w-48 rounded" />
          <button onClick={handleSave} className="w-full mt-2 bg-blue-600 text-white py-1 rounded">
            저장하기
          </button>
        </div>
      )}

      <div id="hand-debug-layer" className="absolute inset-0 pointer-events-none z-50" />
      {stones.map((stone) =>
        !stone.collected ? (
          <img
            key={stone.id}
            src={assets[targetImage]}
            alt="stone"
            className="absolute w-16 h-16"
            style={{ left: `${stone.x}%`, top: `${stone.y}%` }}
          />
        ) : null
      )}
    </div>
  );
};

export default WebcamCollectStoneMission;
