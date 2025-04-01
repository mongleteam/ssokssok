import React, { useEffect, useRef, useState } from "react";
import { useFingerTracking } from "../../hooks/useFingerTracking";

const HOLD_DURATION = 3000; // 3초 머물기

const TreasureHuntMission = ({
  onComplete,
  setStatusContent,
  missionProps,
  assets,
}) => {
  const videoRef = useRef(null);
  const { fingerPos } = useFingerTracking(videoRef);

  const [selectedDoor, setSelectedDoor] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [hoveredDoor, setHoveredDoor] = useState(null);
  const [hoverStartTime, setHoverStartTime] = useState(null);

  const doors = ["left", "mid", "right"];
  const [treasureDoor, setTreasureDoor] = useState(null);

  useEffect(() => {
    const rand = Math.floor(Math.random() * 3);
    setTreasureDoor(doors[rand]);
  }, []);

  const handleDoorClick = (door) => {
    if (isCompleted || selectedDoor) return;
    setSelectedDoor(door);

    if (door === treasureDoor) {
      const imgMap = {
        left: "page35_interaction_left.jpg",
        mid: "page35_interaction_mid.jpg",
        right: "page35_interaction_right.jpg",
      };
      setResultImage(assets[imgMap[door]]);
      setIsCompleted(true);
      onComplete?.();
    } else {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 2000);
      setSelectedDoor(null);
    }
  };

  const getDoorZone = () => {
    if (!fingerPos) return null;
    const x = 1 - fingerPos.x;
    if (x < 0.33) return "left";
    if (x < 0.66) return "mid";
    return "right";
  };

  // 손가락 위치 감지하여 3초 머무르면 선택
  useEffect(() => {
    if (!fingerPos || selectedDoor || isCompleted) return;

    const currentDoor = getDoorZone();

    if (currentDoor !== hoveredDoor) {
      setHoveredDoor(currentDoor);
      setHoverStartTime(Date.now());
    } else {
      const now = Date.now();
      if (hoverStartTime && now - hoverStartTime >= HOLD_DURATION) {
        handleDoorClick(currentDoor);
        setHoverStartTime(null);
      }
    }
  }, [fingerPos, hoveredDoor, hoverStartTime, selectedDoor, isCompleted]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = isCompleted ? (
      <div className="text-3xl font-bold text-green-700 animate-pulse">
        보물을 찾았어요! 🎉
      </div>
    ) : showNotice ? (
      <div className="text-xl font-bold text-red-600 animate-shake">
        다시 시도해보세요!
      </div>
    ) : (
      <div className="text-xl text-gray-700">
        문 위에 3초간 손을 머물러 보세요!
      </div>
    );
    setStatusContent(ui);
  }, [isCompleted, showNotice]);

  const baseImage = resultImage || assets["page35_interaction.jpg"];
  const noticeImage = assets["page35_interaction_notice.png"];

  return (
    <div className="relative w-[54rem] aspect-video torn-effect mt-6 mb-3 overflow-hidden">
      {baseImage && (
        <img
          src={baseImage}
          alt="doors"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {showNotice && noticeImage && (
        <img
          src={noticeImage}
          alt="notice"
          className="absolute w-60 h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        />
      )}

      {fingerPos && (
        <div
          className="absolute w-6 h-6 bg-yellow-400 rounded-full z-50"
          style={{
            left: `${(1 - fingerPos.x) * 100}%`,
            top: `${fingerPos.y * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        className="absolute top-4 right-4 w-52 h-30 object-cover scale-x-[-1] border-2 border-white rounded z-50"
      />
    </div>
  );
};

export default TreasureHuntMission;
