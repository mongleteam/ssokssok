import React from "react";
import CollectStoneOverlay from "../multi/mission/CollectStoneOverlay";
import EatCookie from "../multi/mission/EatCookie";
import RockScissorsPaper from "../multi/mission/RockScissorsPaper";
import WebcamGetKey from "../multi/mission/WebcamGetKey";
import CleanMissionMulti from "../multi/mission/CleanMission";
import SilentMissionMulti from "../multi/mission/SilentMissionMulti";
import HanselReadText from "../multi/mission/HanselReadText";
import GretelReadText from "../multi/mission/GretelReadText";

const MissionRouter = ({
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
  setPeerStones, 
  setStoneImage,
  setPeerCookieCount,
}) => {
  const alwaysRenderTypes = ["webcam-readtext-multi-first", "webcam-readtext-multi-second"];
  const parsedRole = role === "헨젤" ? 1 : role === "그레텔" ? 2 : null;
  const isMatched =
    alwaysRenderTypes.includes(type) || // 대사 미션은 예외 처리
    !missionRole ||
    missionRole === 3 ||
    missionRole === parsedRole;

  if (!isMatched) return null;

  switch (type) {
    case "webcam-collect-stone-multi":
      return (
        <CollectStoneOverlay
          assets={assets}
          missionData={missionData}
          publisher={publisher}
          onSuccess={onSuccess}
          roomId={roomId}
          userName={role}
          from={from}
          setStatusContent={setStatusContent}
          setPeerStones={setPeerStones}
          setStoneImage={setStoneImage}
        />
      );
    case "webcam-eatcookie":
      return (
        <EatCookie
          onSuccess={onSuccess}
          setStatusContent={setStatusContent}
          missionData={missionData}
          assets={assets}
          publisher={publisher}
          roomId={roomId}
          userName={role}
          from={from}
          setPeerCookieCount={setPeerCookieCount}
        />
      );
    case "webcam-get-magicbook-multi":
      return (
        <RockScissorsPaper
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

    case "webcam-getkey-multi":
      return (
        <WebcamGetKey
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

    case "webcam-clean-multi":
      return (
        <CleanMissionMulti
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

    case "webcam-silent-multi":
      return (
        <SilentMissionMulti
          onSuccess={onSuccess}
          setStatusContent={setStatusContent}
          roomId={roomId}
          userName={role}
          publisher={publisher} // ✅ 꼭 추가
        />
      );
    case "webcam-readtext-multi-second":
      return (
        <HanselReadText
          onSuccess={onSuccess}
          setStatusContent={setStatusContent}
          missionData={missionData}
          roomId={roomId}
          userName={role}
          publisher={publisher}
        />
      );
    case "webcam-readtext-multi-first":
      return (
        <GretelReadText
          onSuccess={onSuccess}
          setStatusContent={setStatusContent}
          missionData={missionData}
          roomId={roomId}
          userName={role}
          publisher={publisher}
        />
      );

    // case "webcam-draw-star-multi":
    //   return <DrawStarMission ... />;
    default:
      return null;
  }
};

export default MissionRouter;
