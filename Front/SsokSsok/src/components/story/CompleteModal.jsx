import React from "react";
import { useNavigate } from "react-router-dom";
import boardBackground from "../../assets/images/board3.png";
import greenButton from "../../assets/images/btn_green.png";

const CompleteModal = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/main");
  };

  const handleGoAlbum = () => {
    navigate("/main/myalbum");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div
        className="relative w-[60%] h-[40%] flex flex-col items-center justify-center bg-center bg-no-repeat bg-[length:100%_100%]"
        style={{ backgroundImage: `url(${boardBackground})` }}
      >
        <h1 className="font-whitechalk text-5xl text-black mb-4">독서 완료</h1>

        <p className="font-whitechalk text-xl text-black text-center leading-relaxed mb-10 px-10">
          동화 속으로 쏙! 재미가 쏙쏙! <br />
          멋진 이야기 탐험가가 되었어요!
        </p>

        <div className="flex gap-8">
          <button
            onClick={handleGoHome}
            className="relative w-52 h-20 text-black font-whitechalk text-2xl hover:scale-105 transition-transform duration-200"
          >
            <img
              src={greenButton}
              alt="홈으로"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <span className="relative z-10">홈으로</span>
          </button>

          <button
            onClick={handleGoAlbum}
            className="relative w-52 h-20 text-black font-whitechalk text-2xl hover:scale-105 transition-transform duration-200"
          >
            <img
              src={greenButton}
              alt="마이 앨범"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <span className="relative z-10">마이 앨범</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteModal;
