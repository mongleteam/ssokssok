import React, { useState } from "react";
import boardImage from "../../assets/images/board2.png";
import hintIcon from "../../assets/images/hint_icon.png"; // 힌트 아이콘 경로
import HintModal from "../../components/story/HintModal"; // HintModal 컴포넌트 임포트

const MissionScreen = ({ missionText = "미션 여기에 출력", progress = 0 }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const openModal = () => setIsModalOpen(true); // 모달 열기
  const closeModal = () => setIsModalOpen(false); // 모달 닫기

  return (
    <div
      className="relative flex items-center justify-center w-full h-[150px] bg-no-repeat bg-center bg-[length:100%_100%]"
      style={{ backgroundImage: `url(${boardImage})` }}
    >
      {/* 힌트 아이콘 */}
      <button
        className="absolute top-1 right-2 w-10 h-10 flex items-center justify-center bg-transparent hover:scale-110 transition-transform duration-300 m-6 z-10"
        onClick={openModal} // 버튼 클릭 시 모달 열기
      >
        <img src={hintIcon} alt="힌트" className="w-full h-full" />
      </button>

      {/* 미션 텍스트 */}
      <div className="text-center font-cafe24">
        <h2 className="text-lg font-bold">{missionText}</h2>
        <p className="mt-2 text-sm font-medium">{progress} / 10</p>
      </div>

      {/* HintModal 컴포넌트 */}
      {isModalOpen && <HintModal onClose={closeModal} />} {/* 모달 열림 여부에 따라 렌더링 */}
    </div>
  );
};

export default MissionScreen;
