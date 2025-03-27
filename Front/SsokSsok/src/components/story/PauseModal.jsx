// src/components/story/PauseModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import boardBackground from "../../assets/images/board3.png";
import greenButton from "../../assets/images/btn_green.png";

const PauseModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div
        className="relative w-[60%] h-[40%] flex flex-col items-center justify-center bg-center bg-no-repeat bg-[length:100%_100%]"
        style={{ backgroundImage: `url(${boardBackground})` }}
      >
        <h1 className="font-whitechalk text-5xl text-black mb-4">그만 읽기</h1>

        <p className="font-whitechalk text-xl text-black text-center leading-relaxed mb-10 px-10">
          읽기 기록 저장 완료! <br />
          다음에 이 페이지부터 다시 읽을 수 있어요.
        </p>

        <button
          onClick={() => navigate("/main")}
          className="relative w-52 h-20 text-black font-whitechalk text-2xl hover:scale-105 transition-transform duration-200"
        >
          <img
            src={greenButton}
            alt="홈으로"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <span className="relative z-10">홈으로</span>
        </button>
      </div>
    </div>
  );
};

export default PauseModal;
