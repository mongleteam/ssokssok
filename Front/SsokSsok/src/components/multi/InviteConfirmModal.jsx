import React from "react";
import closeIcon from "../../assets/images/remove_icon.png";
import board3 from "../../assets/images/board3.png";

const InviteConfirmModal = ({ friend, onConfirm, onCancel }) => {
  return (
    <div className="modal-wrapper">
      <div className="relative w-[70rem]">
        <img src={board3} alt="모달 배경" className="w-full h-auto" />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-10">
          <button
            className="absolute top-[2.5rem] right-[1.5rem] w-12 h-12"
            onClick={onCancel}
          >
            <img src={closeIcon} alt="닫기" />
          </button>

          <h2 className="modal-title mt-16 text-center leading-relaxed">
            <span className="text-yellow-300">{friend}</span>님께<br />
            함께 읽기 요청을 보내시겠습니까?
          </h2>

          <div className="mb-10">
            <button className="confirm-button" onClick={onConfirm}>
              요청 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteConfirmModal;
