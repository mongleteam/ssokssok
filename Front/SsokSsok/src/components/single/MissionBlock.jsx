import React, { useState } from "react";
import boardImage from "../../assets/images/board2.png";
import hintIcon from "../../assets/images/hint_icon.png";
import HintModal from "../../components/story/HintModal";

const MissionBlock = ({ MissionComponent, onComplete, hintImage }) => {
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  if (!MissionComponent) return null;

  return (
    <div className="w-full flex flex-col items-center">
    <div className="w-full max-w-5xl px-4">
    <div
      className="relative w-full px-8 py-6 bg-no-repeat bg-center bg-contain min-h-[120px]"
      style={{
        backgroundImage: `url(${boardImage})`,
        backgroundSize: "100% 100%",
      }}
    >
      {/* ✅ 미션 컴포넌트가 없을 경우에도 최소 높이 확보 */}
      <div className="flex flex-col items-center justify-center w-full min-h-[80px]">
        {MissionComponent ? (
          <MissionComponent onComplete={onComplete} />
        ) : (
          <p className="text-transparent select-none">_</p> // 시각적 높이 확보용
        )}
      </div>

      {hintImage && (
        <button
          className="absolute top-3 right-4 w-10 h-10 hover:scale-110 transition-transform"
          onClick={() => setIsHintModalOpen(true)}
        >
          <img src={hintIcon} alt="힌트" className="w-full h-full" />
        </button>
      )}
    </div>
  </div>

  {/* 힌트 모달 */}
  {isHintModalOpen && (
    <HintModal
      hintImage={hintImage}
      onClose={() => setIsHintModalOpen(false)}
    />
  )}
</div>
  );
};

export default MissionBlock;
