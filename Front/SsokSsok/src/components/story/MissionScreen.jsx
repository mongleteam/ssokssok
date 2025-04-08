import React, { useState, useEffect } from "react";
import boardImage from "../../assets/images/board2.png";
import hintIcon from "../../assets/images/hint_icon.png"; // 힌트 아이콘 경로
import HintModal from "../../components/story/HintModal"; // 힌트 모달 컴포넌트 임포트
import { onSocketEvent, offSocketEvent } from "../../services/socket";

const MissionScreen = ({
  storyData,
  assets,
  statusContent,
  setStatusContent,
  userName,
}) => {
  const [missionText, setMissionText] = useState(""); // 지시사항 텍스트 상태
  const [isHintModalOpen, setIsHintModalOpen] = useState(false); // 힌트 모달 상태
  useEffect(() => {
    console.log("현재 사용자 이름:", userName);
  }, [userName]);
  useEffect(() => {
    const fetchMission = async () => {
      if (!storyData?.mission?.instructions) {
        setMissionText("지시사항이 없습니다.");
        return;
      }

      try {
        const missionUrl = assets[storyData.mission.instructions];
        if (!missionUrl) {
          throw new Error("지시사항 파일 URL이 없습니다.");
        }

        const res = await fetch(missionUrl);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        setMissionText(text);
      } catch (e) {
        console.error("지시사항 파일 로딩 실패:", e);
        setMissionText("지시사항을 불러올 수 없습니다.");
      }
    };

    fetchMission();
  }, [storyData, assets]);

  // 소켓 이벤트를 수신하여, 상대 화면에서 보내진 sendRts 이벤트에 따른 메시지를 업데이트
  useEffect(() => {
    const handleSendRts = (data) => {
      if (!data || !data.rps) return;

      if (userName == "헨젤") return;

       if (data.rps === "retry") {
         setStatusContent(
           <div className="text-2xl text-center font-bold text-sky-700 animate-pulse font-cafe24">
             가위바위보 진행 중...
           </div>
         );
         return;
       }

      let message = "";
      if (data.rps === "패배") {
        message = "😵 패배 - 친구가 졌어요..";
      } else if (data.rps === "무승부") {
        message = "😐 무승부 - 친구가 비겼어요..";
      } else {
        message = "✅ 성공! 다음 페이지로 넘어가세요.";
      }

      setStatusContent(
        <div className="text-3xl text-center font-bold animate-pulse text-amber-700 font-cafe24">
          {message}
        </div>
      );
    };

    onSocketEvent("sendRts", handleSendRts);

    return () => {
      offSocketEvent("sendRts");
    };
  }, [setStatusContent]);
  const handleHintClick = () => {
    setIsHintModalOpen(true);
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full bg-no-repeat bg-center bg-[length:100%_100%]"
      style={{ backgroundImage: `url(${boardImage})` }}
    >
      {/* 미션 텍스트 */}
      <div className="text-center font-cafe24">
        <h2 className="text-3xl font-bold pb-2">미션!</h2>
        <p className="mt-2 text-lg font-medium whitespace-pre-line">
          {missionText}
        </p>
        {statusContent && <div className="mt-6">{statusContent}</div>}
      </div>

      {/* 힌트 아이콘 */}
      {storyData.mission?.hintImage && (
        <button
          className="absolute top-1 right-2 w-12 h-12 flex items-center justify-center bg-transparent hover:scale-110 transition-transform duration-300 m-6 z-10"
          onClick={handleHintClick}
        >
          <img src={hintIcon} alt="힌트" className="w-full h-full" />
        </button>
      )}

      {/* 힌트 모달 */}
      {isHintModalOpen && (
        <HintModal
          onClose={() => setIsHintModalOpen(false)}
          hintImage={storyData.mission.hintImageFile}
        />
      )}
    </div>
  );
};

export default MissionScreen;
