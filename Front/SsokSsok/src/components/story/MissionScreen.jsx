import React, { useState, useEffect } from "react";
import boardImage from "../../assets/images/board2.png";
import hintIcon from "../../assets/images/hint_icon.png"; // 힌트 아이콘 경로
import HintModal from "../../components/story/HintModal"; // 힌트 모달 컴포넌트 임포트

const MissionScreen = ({ storyData, assets }) => {
  const [missionText, setMissionText] = useState(""); // 지시사항 텍스트 상태
  const [isHintModalOpen, setIsHintModalOpen] = useState(false); // 힌트 모달 상태

  useEffect(() => {
    const fetchMission = async () => {
      if (!storyData?.mission?.instructions) {
        setMissionText("지시사항이 없습니다.");
        return;
      }

      try {
        const missionUrl = assets[storyData.mission.instructions];
        if (!missionUrl) {
          throw new Error("지시사항 파일 URL이 없습니다.");
        }

        const res = await fetch(missionUrl);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        setMissionText(text);
      } catch (e) {
        console.error("지시사항 파일 로딩 실패:", e);
        setMissionText("지시사항을 불러올 수 없습니다.");
      }
    };

    fetchMission();
  }, [storyData, assets]);

  const handleHintClick = () => {
    setIsHintModalOpen(true);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full bg-no-repeat bg-center bg-[length:100%_100%]"
      style={{ backgroundImage: `url(${boardImage})` }}
    >
      {/* 미션 텍스트 */}
      <div className="text-center font-cafe24">
        <h2 className="text-3xl font-bold pb-2">미션!</h2>
        <p className="mt-2 text-lg font-medium whitespace-pre-line">
          {missionText}
        </p>
      </div>

      {/* 힌트 아이콘 */}
      {storyData.mission?.hintImage && (
        <button
          className="absolute top-1 right-2 w-12 h-12 flex items-center justify-center bg-transparent hover:scale-110 transition-transform duration-300 m-6 z-10"
          onClick={handleHintClick}
        >
          <img src={hintIcon} alt="힌트" className="w-full h-full" />
        </button>
      )}

      {/* 힌트 모달 */}
      {isHintModalOpen && (
        <HintModal
          onClose={() => setIsHintModalOpen(false)}
          hintImage={storyData.mission.hintImageFile}
        />
      )}
    </div>
  );
};

export default MissionScreen;
