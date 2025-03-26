import React from "react";
import hintModalBackground from "../../assets/images/hint_modal_background.png"; // 힌트 모달 배경 이미지
import closeButton from "../../assets/images/remove_icon.png"; // 닫기 버튼 이미지

const HintModal = ({ onClose, hintImage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      {/* 모달 컨테이너 */}
      <div
        className="relative bg-cover bg-center w-[50rem] h-[40rem] flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${hintModalBackground})` }}
        >
        <h1 className="font-cafe24 text-4xl">힌트</h1>
        {/* 닫기 버튼 */}
        <button
          className="absolute top-2 m-10 right-2 w-14 h-14 hover:scale-110 transition-transform duration-300"
          onClick={onClose}
        >
          <img src={closeButton} alt="닫기" className="w-full h-full" />
        </button>

        {/* 힌트 이미지 */}
        <img src={hintImage} alt="힌트 이미지" className="w-[30rem] h-[20rem] object-contain" />
      </div>
    </div>
  );
};

export default HintModal;
