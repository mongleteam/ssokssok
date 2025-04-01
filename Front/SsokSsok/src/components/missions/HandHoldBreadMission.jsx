import React, { useEffect, useRef, useState } from "react";
import { useFingerTracking } from "../../hooks/useFingerTracking";

const MAX_BREAD = 3;
const HOLD_DURATION = 3000; // 3초

const HandHoldBreadMission = ({ onComplete, setStatusContent, missionProps, assets }) => {
  const videoRef = useRef(null);
  const { fingerPos } = useFingerTracking(videoRef);
  const [breads, setBreads] = useState([]);  // 빵 위치 
  const [heldBread, setHeldBread] = useState(null);   // 현재 손 머무르고 있는 빵빵
  const [holdStartTime, setHoldStartTime] = useState(null);
  const [collectedCount, setCollectedCount] = useState(0);
  const [missionMessage, setMissionMessage] = useState("");

  const breadImg = missionProps.instructionImages?.[0];  // 빵
  const bgImg = missionProps.instructionImages?.[1];   //  배경
  const soundEffect = missionProps.soundEffect?.[0];

  // 초기 빵 랜덤 배치
  useEffect(() => {
    if (!assets[breadImg]) return;

    const placed = [];
    const MIN_DISTANCE = 20; // 💡 빵 사이 최소 거리 (% 기준)

    while (placed.length < MAX_BREAD) {
      const x = Math.random() * 65 + 10;  // 캠 위치 피하기 위함(임의 조정)
      const y = Math.random() * 65 + 25;  

      const tooClose = placed.some((b) => {
        const dx = b.x - x;
        const dy = b.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < MIN_DISTANCE;
      });

      if (!tooClose) {
        placed.push({ id: placed.length, x, y, collected: false });
      }
    }

    setBreads(placed);
  }, [assets, breadImg]);

  // 손 위치로 수집 판단
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
      const dy = Math.abs(bread.y - fingerPos.y * 100);
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

        // 사운드 효과 재생
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

  // 성공 체크
  useEffect(() => {
    if (collectedCount >= MAX_BREAD) {
      setMissionMessage("✅ 성공! 다음 페이지로 넘어가세요.");
      onComplete?.();
    }
  }, [collectedCount, onComplete]);

  // 상태 UI
  useEffect(() => {
    if (!setStatusContent) return;
    const ui = (
      <div className="text-3xl font-cafe24 text-brown-800">
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
    <div className="relative w-[54rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      {/* 배경 이미지 */}
      {assets[bgImg] && (
        <img
          src={assets[bgImg]}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* 빵 표시 */}
      {breads.map((bread) =>
        !bread.collected ? (
          <img
            key={bread.id}
            src={assets[breadImg]}
            alt="bread"
            className="absolute w-16 h-16 z-10"
            style={{ left: `${bread.x}%`, top: `${bread.y}%` }}
          />
        ) : null
      )}

      {/* 손가락 위치 디버그용 도트 */}
      {fingerPos && (
        <div
          className="absolute w-6 h-6 bg-red-500 rounded-full z-50"
          style={{
            left: `${(1 - fingerPos.x) * 100}%`,
            top: `${fingerPos.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* 사용자 웹캠 오른쪽 상단에 작게 표시 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="absolute top-4 right-4 w-52 h-30 object-cover scale-x-[-1] border-2 border-white rounded z-50"
      />
    </div>
  );
};

export default HandHoldBreadMission;