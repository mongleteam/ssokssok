// ✅ 리팩토링된 SingleStoryRenderer.jsx
import React, { useState, useEffect, useRef } from "react";
import pageNextButton from "../../assets/images/pagenext_icon.png";
import pagePreviousButton from "../../assets/images/pageprevious_icon.png";
import SingleStoryIllustration from "../single/SingleStoryIllustration";
import { missionMap } from "../missions";
import StoryDialogueBlock from "../single/StroyDialogueBlock";
import MissionBlock from "../single/MissionBlock";

const SingleStoryRenderer = ({ story, assets }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [scriptText, setScriptText] = useState("");
  const [missionReady, setMissionReady] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const audioRef = useRef(null);
  const [isAudioEnded, setIsAudioEnded] = useState(false);

  if (!story || !story.length) {
    return <div className="text-center font-bold mt-10">스토리 없음 😢</div>;
  }

  const page = story[currentPage];
  const hasMission = !!page.mission;
  const MissionComponent = hasMission ? missionMap[page.mission.type] : null;

  // 대사 or 미션 지시사항 불러오기기
  useEffect(() => {
    const fetchText = async () => {
      const textFile = showMission ? page.mission?.instructions : page.script;
      if (!textFile || !assets[textFile]) return setScriptText("");

      try {
        const res = await fetch(assets[textFile]);
        const text = await res.text();
        setScriptText(text);
      } catch (e) {
        console.error("📛 텍스트 로딩 실패:", e);
        setScriptText("❌ 텍스트를 불러올 수 없습니다.");
      }
    };

    fetchText();
  }, [page, showMission, assets]);

  // TTS 자동 재생
  useEffect(() => {
    if (!page.tts || !assets[page.tts]) return;
    const timeout = setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 1000);
    return () => clearTimeout(timeout);
  }, [page.tts, assets]);

  // 오디오 종료 감지
  useEffect(() => {
    setIsAudioEnded(false);
    const audio = audioRef.current;

    if (!audio) return;
    const handleEnded = () => setIsAudioEnded(true);
    audio.addEventListener("ended", handleEnded);

    return () => audio.removeEventListener("ended", handleEnded);
  }, [page.tts]);


  // tts 끝나고 미션 진입 가능 여부 설정
  useEffect(() => {
    if (hasMission && isAudioEnded && !showMission) {
      setMissionReady(true);
    }
  }, [hasMission, isAudioEnded, showMission]);


  // 다음
  const handleNext = () => {
    if (missionReady && !showMission) {
      setShowMission(true);
      setMissionReady(false);
      return;
    }
    if (showMission && !missionComplete) return;
    setCurrentPage((prev) => prev + 1);
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);
  };

  // 이전
  const handlePrevious = () => {
    if (currentPage === 0) return;
    setCurrentPage((prev) => prev - 1);
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-4">
      {/* 👁️ 시각 영역 */}
      <div className="w-full">
        {showMission && MissionComponent ? (
          <MissionComponent
            onComplete={() => {
              setMissionComplete(true);
              setTimeout(() => console.log("✅ 미션 완료"), 100);
            }}
          />
        ) : (
          <SingleStoryIllustration src={assets[page.illustration]} />
        )}
      </div>

      {/* 📝 콘텐츠 영역 */}
      <div className="w-full">
        {showMission && MissionComponent ? (
          <MissionBlock
            MissionComponent={() => null}
            onComplete={() => {}}
            hintImage={page.hintImage}
          />
        ) : (
          <StoryDialogueBlock text={scriptText} />
        )}
      </div>

      {/* TTS */}
      {page.tts && (
        <audio ref={audioRef} src={assets[page.tts]} style={{ display: "none" }} />
      )}

      {/* 🔽 이전/다음 페이지 네비게이션 버튼 */}
      <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none">
      {/* 왼쪽: 이전 버튼 or placeholder */}
      {currentPage > 0 ? (
        <img
          src={pagePreviousButton}
          alt="이전 페이지"
          onClick={handlePrevious}
          className="w-20 h-20 cursor-pointer pointer-events-auto"
        />
      ) : (
        <div className="w-20 h-20" /> // 👈 placeholder!
      )}

      {/* 오른쪽: 다음 버튼 or placeholder */}
      {currentPage < story.length - 1 ? (
        <img
          src={pageNextButton}
          alt="다음 페이지"
          onClick={handleNext}
          className={`w-20 h-20 cursor-pointer pointer-events-auto transition-opacity duration-300 ${
            (!hasMission && isAudioEnded) ||
            (missionReady && !showMission) ||
            (showMission && missionComplete)
              ? "opacity-100 animate-blinkTwice brightness-110"
              : "opacity-30 pointer-events-none grayscale"
          }`}
        />
      ) : (
        <div className="w-20 h-20" /> // 👈 placeholder!
      )}
    </div>
    </div>
  );
};

export default SingleStoryRenderer;
