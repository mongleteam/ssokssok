import React, { useEffect, useState, useRef } from "react";
import closeIcon from "../../assets/images/remove_icon.png";
import "../../styles/multi/start_modal.css";
import modalBg from "../../assets/images/board3.png";
import { onSocketEvent, offSocketEvent } from "../../services/socket"; // socket 이벤트 등록/해제 함수

const WaitingModal = ({
  onClose,
  friend,
  role,
  roomId,
  onTimeout,
  mode = "waiting", // "waiting" | "confirmed"
}) => {
  const isWaiting = mode === "waiting";
  const [timeLeft, setTimeLeft] = useState(180); // 3분
  const hasTimedOutRef = useRef(false);

  // ⏱ 타이머 (waiting 모드일 때만)
  useEffect(() => {
    if (!isWaiting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasTimedOutRef.current) {
            hasTimedOutRef.current = true;
            setTimeout(() => {
              onTimeout?.(); // 한 번만 호출
            }, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWaiting, onTimeout]);

  // 🎉 상대방 입장 감지 → 초대자만
  useEffect(() => {
    if (!isWaiting) return;

    onSocketEvent("inviteeJoined", () => {
      console.log("🎉 소켓소켓 상대방이 입장했습니다!");
      onClose(true); // 자동 종료
    });

    return () => {
      offSocketEvent("inviteeJoined");
    };
  }, [onClose, isWaiting]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleClick = () => {
    onClose(false); // 수동 닫기 or '시작하기'
  };

  return (
    <div className="modal-wrapper">
      <div className="relative w-[70rem]">
        <img src={modalBg} alt="모달 배경" className="w-full h-auto" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-10">

          {/* 제목 */}
          <h2 className="modal-title mt-20 text-center leading-relaxed whitespace-pre-line">
            {isWaiting
              ? `${friend.nickname || friend.friendId}님께 초대 요청을 보냈습니다.\n잠시만 기다려주세요...`
              : `${friend.nickname || friend.friendId}님이 초대를 수락했어요!\n이제 시작해볼까요?`}
          </h2>

          {/* 역할 안내 */}
          {/* <p className="text-white text-2xl mt-4 font-dongle">
            {isWaiting
              ? `${role} 역할로 준비 중입니다.`
              : "시작 버튼을 누르면 동화가 시작됩니다!"}
          </p> */}

          {/* 타이머 */}
          {isWaiting && (
            <div className="text-5xl mt-6 font-whitechalk drop-shadow-md">
              ⏳ {formatTime(timeLeft)}
            </div>
          )}

          {/* 버튼 중앙 정렬 */}
          <div className="mb-20 flex justify-center">
            <button
              className="multi-confirm-button"
              onClick={handleClick}
            >
              {isWaiting ? "초대 취소" : "시작하기"}
            </button>
          </div>
        </div>
      </div>
    </div>


  );
};

export default WaitingModal;