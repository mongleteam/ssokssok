import React, { useRef, useEffect, useState } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { useFingerTracking } from "../../hooks/useFingerTracking";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import CountdownOverlay from "../webcam/CountdownOverlay";
const MAX_BREAD = 3;
const HOLD_DURATION = 3000; // 3초

const HandHoldBreadMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const {
    handLandmarks,
    previewUrl,
    showModal,
    countdown,
    setShowModal,
    handleSave,
  } = useTrackingCore(videoRef);

  const fingerPos = useFingerTracking(handLandmarks);

  const [breads, setBreads] = useState([]);
  const [heldBread, setHeldBread] = useState(null);
  const [holdStartTime, setHoldStartTime] = useState(null);
  const [collectedCount, setCollectedCount] = useState(0);
  const [missionMessage, setMissionMessage] = useState("");

  const breadImg = missionProps.instructionImages?.[0];
  const bgImg = missionProps.instructionImages?.[1];
  const soundEffect = missionProps.soundEffect?.[0];

  useEffect(() => {
    if (!assets[breadImg]) return;

    const placed = [];
    const MIN_DISTANCE = 20;
    while (placed.length < MAX_BREAD) {
      const x = Math.random() * 70 + 10;
      const y = Math.random() * 65 + 25;
    
      // 웹캠 영역 대략적으로 피하기 (오른쪽 상단)
      const isOverlappingWebcam = x > 75 && y < 30;
      if (isOverlappingWebcam) continue;
    
      const tooClose = placed.some((b) => {
        const dx = b.x - x;
        const dy = b.y - y;
        return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE;
      });
    
      if (!tooClose) {
        placed.push({ id: placed.length, x, y, collected: false });
      }
    }
    setBreads(placed);
  }, [assets, breadImg]);

  useEffect(() => {
    if (!fingerPos) {
      setHeldBread(null);
      setHoldStartTime(null);
      return;
    }

    const now = Date.now();
    let found = null;
    for (const bread of breads) {
      if (bread.collected) continue;
      const dx = Math.abs(bread.x - (1 - fingerPos.x) * 100);
      const dy = Math.abs(bread.y - (fingerPos.y-0.03) * 100);
      if (dx < 10 && dy < 10) {
        found = bread;
        break;
      }
    }

    if (found) {
      if (!heldBread || heldBread.id !== found.id) {
        setHeldBread(found);
        setHoldStartTime(now);
      } else if (now - holdStartTime >= HOLD_DURATION) {
        setBreads((prev) =>
          prev.map((b) => (b.id === found.id ? { ...b, collected: true } : b))
        );
        setCollectedCount((c) => c + 1);
        setHeldBread(null);
        setHoldStartTime(null);

        if (soundEffect && assets[soundEffect]) {
          const audio = new Audio(assets[soundEffect]);
          audio.play();
        }
      }
    } else {
      setHeldBread(null);
      setHoldStartTime(null);
    }
  }, [fingerPos, breads, heldBread, holdStartTime, soundEffect, assets]);

  useEffect(() => {
    if (collectedCount >= MAX_BREAD) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    }
  }, [collectedCount, onComplete]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = (
      <div className="text-2xl font-cafe24 text-brown-800">
        {missionMessage ? (
          <div className="text-green-700 animate-pulse font-cafe24">{missionMessage}</div>
        ) : (
          <div className="font-cafe24">{collectedCount} / {MAX_BREAD}</div>
        )}
      </div>
    );
    setStatusContent(ui);
  }, [collectedCount, missionMessage]);

  return (
    <div
      id="capture-container"
      className="relative w-[48rem] aspect-video torn-effect mb-3 overflow-hidden"
    >
      {assets[bgImg] && (
        <img
          src={assets[bgImg]}
          alt="background"
          className="absolute inset-0 w-full h-full object-fill z-0"
        />
      )}

      {breads.map((bread) =>
        !bread.collected ? (
          <img
            key={bread.id}
            src={assets[breadImg]}
            alt="bread"
            className="absolute w-12 h-12 z-10 "
            style={{ left: `${bread.x}%`, top: `${bread.y}%`, filter: "drop-shadow(0 0 2px white) drop-shadow(0 0 5px white)" }}
          />
        ) : null
      )}

      {fingerPos && (
        <div
          className="absolute text-6xl z-40"
          style={{
            left: `${(1 - fingerPos.x) * 100}%`,
            top: `${fingerPos.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
          >
            👆
       </div>
      )}

      {countdown !== null && <CountdownOverlay count={countdown} />}

      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        className="absolute top-4 right-4 w-48 h-30 object-cover scale-x-[-1] border-2 border-white rounded z-40"
      />
    </div>
  );
};

export default HandHoldBreadMission;