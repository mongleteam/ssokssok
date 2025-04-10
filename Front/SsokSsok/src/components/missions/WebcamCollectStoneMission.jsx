import React, { useEffect, useRef, useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { useHandPose } from "../../hooks/useHandPose";
import CountdownOverlay from "../webcam/CountdownOverlay";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import  { captureWithVideoOverlay } from "../../utils/captureWithVideoOverlay";
const WebcamCollectStoneMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const missionRef = useRef(null);
  const hoverCountRef = useRef(0);  // Hover 유지 프레임 체크

  const [collected, setCollected] = useState(0);
  const [stones, setStones] = useState([]);
  const [hoveredStoneId, setHoveredStoneId] = useState(null);
  const [lastHoveredStoneId, setLastHoveredStoneId] = useState(null);
  const [missionMessage, setMissionMessage] = useState("");

  const { handLandmarks, showModal, previewUrl, handleSave, countdown, setShowModal } =
    useTrackingCore(videoRef, 1, captureWithVideoOverlay);

  const { getHandCenter, isHandOpen, isHandClosed } = useHandPose(handLandmarks);

  const targetImage = missionProps.instructionImages?.[0];
  const soundSrc = missionProps.soundEffect?.[0];
  const MAX_STONES = 5;

  useEffect(() => {
    const setupCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        // console.error("포트 접근 실패:", err);
      }
    };
    setupCam();
  }, []);

  useEffect(() => {
    if (!assets[targetImage]) return;

    const newStones = [];
    const minDistance = 23;
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
  }, [assets, targetImage]);

  useEffect(() => {
    const center = getHandCenter;
    if (!center || !isHandOpen) {
      setHoveredStoneId(null);
      return;
    }

    const hovered = stones.find(
      (stone) =>
        !stone.collected &&
        Math.abs(stone.x / 100 - (1 - center.x)) < 0.08 &&
        Math.abs(stone.y / 100 - center.y) < 0.09
    );

    if (hovered) {
      setHoveredStoneId(hovered.id);
      setLastHoveredStoneId(hovered.id);
    } else {
      setHoveredStoneId(null);
    }
  }, [stones, getHandCenter, isHandOpen]);

  useEffect(() => {
    const center = getHandCenter;
    if (!center || !isHandClosed || lastHoveredStoneId === null) return;

    setStones((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((s) => s.id === lastHoveredStoneId && !s.collected);
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

  // Hover 유지 프레임 체크(2 이상일때만 수집 허용)
  useEffect(() => {
    if (hoveredStoneId !== null) {
      hoverCountRef.current += 1;
    } else {
      hoverCountRef.current = 0;
    }
  }, [hoveredStoneId]);


  useEffect(() => {
    if (collected >= MAX_STONES) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    }
  }, [collected]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = missionMessage ? (
      <div className="text-2xl text-center font-bold text-green-700 animate-pulse font-cafe24">
        {missionMessage}
      </div>
    ) : (
      <div className="text-2xl font-cafe24 text-center font-bold text-stone-900 font-cafe24">
        {collected} / {MAX_STONES}
      </div>
    );
    setStatusContent(ui);
  }, [collected, missionMessage]);

  return (
    <div id="capture-container" ref={missionRef} className="relative w-[48rem] aspect-video torn-effect mb-3 overflow-hidden">
      <video ref={videoRef} autoPlay muted className="w-full h-full object-cover scale-x-[-1]" />
      {countdown !== null && <CountdownOverlay count={countdown} />}
      <div id="hand-debug-layer" className="absolute inset-0 pointer-events-none z-50" />
      {stones.map(
        (stone) =>
          !stone.collected && (
            <img
              key={stone.id}
              src={assets[targetImage]}
              alt="stone"
              className={`absolute w-14 h-14 z-[40] pointer-events-none transition-transform duration-200 ${
                hoveredStoneId === stone.id ? "scale-110 brightness-125" : ""
              }`}
              style={{ left: `${stone.x}%`, top: `${stone.y}%` }}
            />
          )
      )}

      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default WebcamCollectStoneMission;
