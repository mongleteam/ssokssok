// src/components/story/ContinueSingleModal.jsx
import React from "react";
import boardBackground from "../../assets/images/board3.png";
import greenButton from "../../assets/images/btn_green.png";
import goldButton from "../../assets/images/btn_gold.png";

const ContinueSingleModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div
        className="relative w-[60%] h-[45%] flex flex-col items-center justify-center bg-center bg-no-repeat bg-[length:100%_100%]"
        style={{ backgroundImage: `url(${boardBackground})` }}
      >
        <h1 className="font-whitechalk text-5xl text-black mb-6">이어 읽기</h1>

        <p className="font-whitechalk text-xl text-black text-center leading-relaxed mb-8 px-10">
          이전에 읽던 페이지가 있어요! <br />
          해당 페이지부터 이어서 읽을까요?
        </p>

        <div className="flex gap-10">
          <button
            onClick={onConfirm}
            className="relative w-48 h-16 text-black font-whitechalk text-2xl hover:scale-105 transition-transform duration-200"
          >
            <img
              src={greenButton}
              alt="확인"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <span className="relative z-10">확인</span>
          </button>

          <button
            onClick={onCancel}
            className="relative w-48 h-16 text-black font-whitechalk text-2xl hover:scale-105 transition-transform duration-200"
          >
            <img
              src={goldButton}
              alt="취소"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <span className="relative z-10">취소</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueSingleModal;
