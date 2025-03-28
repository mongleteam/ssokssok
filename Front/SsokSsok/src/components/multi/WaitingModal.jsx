import React, { useEffect, useState } from "react";
import closeIcon from "../../assets/images/remove_icon.png";
import "../../styles/multi/start_modal.css";
import modalBg from "../../assets/images/board3.png";

const WaitingModal = ({ friend, role, onTimeout, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(10); // for 3분 타이머

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const secLeft = sec % 60;
    return `${min}:${secLeft.toString().padStart(2, "0")}`;
  };

  return (
    <div className="modal-wrapper">
      <div className="relative w-[70rem]">
        <img src={modalBg} alt="모달 배경" className="w-full h-auto" />

        {/* 오버레이 레이어 */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-10">
          {/* 닫기 버튼 */}
          <button className="absolute top-[2.5rem] right-[1.5rem] w-12 h-12" onClick={onClose}>
            <img src={closeIcon} alt="닫기" />
          </button>

          {/* 메시지 */}
          <h2 className="font-whitechalk text-4xl text-center leading-relaxed">
            {friend}님께 초대 요청을 보냈습니다.<br />
            ⏳잠시만 기다려주세요...
          </h2>

          {/* 타이머 */}
          <div className="font-whitechalk text-5xl mt-6 drop-shadow-md">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingModal;
