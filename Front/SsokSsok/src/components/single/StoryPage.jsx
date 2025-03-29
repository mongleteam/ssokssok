import React from "react";
import VisualArea from "./VisualArea";
import ContentArea from "./ContentArea";
import { missionMap } from "../missions";

const StoryPage = ({ page, showMission, assets, onMissionComplete }) => {
  const MissionComponent = page.mission ? missionMap[page.mission.type] : null;

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-4 mt-8">
      {/* 👁️ 시각 영역 (삽화 또는 미션 콘텐츠) */}
      <VisualArea
        illustration={page.illustration}
        showMission={showMission}
        MissionComponent={MissionComponent}
        assets={assets}
      />

      {/* 📝 콘텐츠 영역 (대사 또는 미션 설명/상태 UI) */}
      <ContentArea
        page={page}
        showMission={showMission}
        MissionComponent={MissionComponent}
        assets={assets}
        onMissionComplete={onMissionComplete}
      />
    </div>
  );
};

export default StoryPage;
