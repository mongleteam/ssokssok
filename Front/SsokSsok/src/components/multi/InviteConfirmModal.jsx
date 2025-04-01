import React from "react";
import closeIcon from "../../assets/images/remove_icon.png";
import board3 from "../../assets/images/board3.png";
import { sendInviteApi } from "../../apis/multiApi";

const InviteConfirmModal = ({ friend, nickname, onConfirm, onClose, mode = "new" }) => {
  const handleClick = async () => {
    try {
      const res = await sendInviteApi(friend);

      if (res.data.isSuccess) {
        const roomId = res.data.data.roomId;
        if (mode === "new") {
          alert(`${friend}님께 초대를 보냈습니다!`);
        }
        onConfirm(roomId); // ✅ 상위에서 navigate 처리
      } else {
        alert(`초대 실패: ${res.data.message}`);
      }
    } catch (error) {
      console.error("초대 요청 실패:", error);
      alert("초대 중 오류가 발생했습니다.");
    }
  };

  const getTitle = () => {
    if (mode === "continue") {
      return (
        <span>
          <span className="text-yellow-300">{nickname || "상대방"}</span>님께<br />
          이어 읽기 요청을 보내시겠습니까?
        </span>
      );
    }
    return (
      <span>
        <span className="text-yellow-300">{nickname || "상대방"}</span>님께<br />
        함께 읽기 요청을 보내시겠습니까?
      </span>
    );
  };

  return (
    <div className="modal-wrapper">
      <div className="relative w-[70rem]">
        <img src={board3} alt="모달 배경" className="w-full h-auto" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-10">
          <button className="absolute top-[2.5rem] right-[1.5rem] w-12 h-12" onClick={onClose}>
            <img src={closeIcon} alt="닫기" />
          </button>

          <h2 className="modal-title mt-20 text-center leading-relaxed">{getTitle()}</h2>

          <div className="flex gap-8 mb-12">
            <button className="multi-confirm-button" onClick={handleClick}>
              요청 보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default InviteConfirmModal;
