import React from "react";
import hintModalBackground from "../../assets/images/hint_modal_background.png"; // 힌트 모달 배경 이미지
import closeButton from "../../assets/images/remove_icon.png"; // 닫기 버튼 이미지

const HintModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      {/* 모달 컨테이너 */}
      <div
        className="relative bg-cover bg-center w-[50rem] h-[40rem] flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${hintModalBackground})` }}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-12 right-2 w-10 h-10 hover:scale-110 transition-transform duration-300"
          onClick={onClose}
        >
          <img src={closeButton} alt="닫기" className="w-full h-full" />
        </button>

        {/* 힌트 내용 */}
        <div className="text-center font-cafe24">
          <h2 className="text-xl font-bold mb-4">힌트</h2>
          <p className="text-sm">힌트 이미지 출력될 위치</p>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
