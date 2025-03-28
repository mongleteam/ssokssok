import React from "react";
import closeIcon from "../../assets/images/remove_icon.png";
import modalBg from "../../assets/images/board3.png"; // ⭐️ 널빤지 이미지 import
import roleBtn from "../../assets/images/board5.png";

const RoleSelectModal = ({ onSelect, onClose, roleOptions }) => {
  const { first, second } = roleOptions;

  return (
    <div className="modal-wrapper">
      {/* 널빤지 이미지 전체 */}
      <div className="relative w-[70rem]">
        <img src={modalBg} alt="모달 배경" className="w-full h-auto" />

        {/* 내용 덮기 레이어 */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-[2.5rem] right-[1.5rem] w-12 h-12"
            onClick={onClose}
          >
            <img src={closeIcon} alt="닫기" />
          </button>

          {/* 타이틀 */}
          <h2 className="modal-title">역할을 선택해주세요.</h2>

          {/* 버튼 영역 */}
          <div className="flex gap-10">
            {[first, second].map((role) => (
              <button
                key={role}
                onClick={() => onSelect(role)}
                className="w-[20rem] h-[10rem] bg-center bg-no-repeat bg-contain text-white font-whitechalk text-5xl flex items-center justify-center pt-[2rem] transform transition-transform hover:scale-105"
                style={{ backgroundImage: `url(${roleBtn})` }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectModal;
