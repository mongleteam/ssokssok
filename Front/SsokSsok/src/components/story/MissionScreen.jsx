import React from "react";
import boardImage from "../../assets/images/board2.png";
import hintIcon from "../../assets/images/hint_icon.png"; // 힌트 아이콘 경로

const MissionScreen = ({ missionText = "미션 텍스트", progress = 0 }) => {
  return (
    <div
      className="relative flex items-center justify-center w-full h-[150px] bg-no-repeat bg-center bg-[length:100%_100%]"
      style={{ backgroundImage: `url(${boardImage})` }}
    >
      {/* 힌트 아이콘 */}
      <button
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent hover:scale-110 transition-transform duration-300 m-4 z-10"
        onClick={() => console.log("힌트 버튼 클릭!")}
      >
        <img src={hintIcon} alt="힌트" className="w-full h-full" />
      </button>

      {/* 미션 텍스트 */}
      <div className="text-center font-cafe24">
        <h2 className="text-lg font-bold">{missionText}</h2>
        <p className="mt-2 text-sm font-medium">{progress} / 10</p>
      </div>
    </div>
  );
};

export default MissionScreen;
