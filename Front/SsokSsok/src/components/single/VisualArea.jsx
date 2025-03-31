import React from "react";
import SingleStoryIllustration from "../single/SingleStoryIllustration";

const VisualArea = ({ illustration, showMission, assets }) => {
  if (showMission) return null; // 미션 중일 땐 아무 것도 렌더하지 않음
  return <SingleStoryIllustration src={assets[illustration]} />;
};

export default VisualArea;
