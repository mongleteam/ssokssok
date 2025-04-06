import React from "react";
import HandHoldBreadOverlay from "../multi/mission/HandHoldBreadOverlay";
import TreasureHunt from "../multi/mission/TreasureHunt";
import DrawStarMission from "../multi/mission/DrawStarMission";
const IllustrationRouter = ({
  type,
  role,
  missionRole,
  missionData,
  assets,
  publisher,
  onSuccess,
  roomId,
  from,
  setStatusContent, // EatCookieMission에 필요하므로 추가
}) => {
  const parsedRole = role === "헨젤" ? 1 : role === "그레텔" ? 2 : null;
  const isMatched =
    !missionRole || missionRole === 3 || missionRole === parsedRole;

  if (!isMatched) return null;

  switch (type) {
    case "hand-hold-bread--multi":
      return (
        <HandHoldBreadOverlay
          onSuccess={onSuccess}
          setStatusContent={setStatusContent}
          missionData={missionData}
          assets={assets}
          publisher={publisher}
          roomId={roomId}
          userName={role}
          from={from}
        />
      );
    case "treasure-hunt":
      return (
        <TreasureHunt
          onSuccess={onSuccess}
          setStatusContent={setStatusContent}
          missionData={missionData}
          assets={assets}
          publisher={publisher}
          roomId={roomId}
          userName={role}
          from={from}
        />
      );
    // case "webcam-silent-multi":
    //   return <SilentMission ... />;
    // case "webcam-draw-star-multi":
    //   return <DrawStarMission ... />;
    case "webcam-draw-multi":
      return (
        <DrawStarMission
          onSuccess={onSuccess}
          missionData={missionData}
          assets={assets}
          publisher={publisher}
          roomId={roomId}
          userName={role}
          from={from}
          setStatusContent={setStatusContent}
        />
      )
    default:
      return null;
  }
};

export default IllustrationRouter;
