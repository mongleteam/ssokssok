import React, { useState, useEffect, useRef } from "react";
import pageNextButton from "../../assets/images/pagenext_icon.png";
import pagePreviousButton from "../../assets/images/pageprevious_icon.png";
import SingleStoryIllustration from "../single/SingleStoryIllustration";
import { missionMap } from "../missions";

const SingleStoryRenderer = ({ story, assets }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [scriptText, setScriptText] = useState("");
  const [missionReady, setMissionReady] = useState(false); // 미션 진입 가능 여부
  const [showMission, setShowMission] = useState(false);   // 미션 실제로 보여주는지
  const [missionComplete, setMissionComplete] = useState(false); // 성공 여부
  const audioRef = useRef(null);
  const [isAudioEnded, setIsAudioEnded] = useState(false);

  if (!story || !story.length) {
    return <div className="text-center font-bold mt-10">스토리 없음 😢</div>;
  }

  const page = story[currentPage];
  const hasMission = !!page.mission;
  const MissionComponent = hasMission ? missionMap[page.mission.type] : null;

  // 대사 텍스트 가져오기 (미션 중이면 instructions 사용)
  useEffect(() => {
    const fetchText = async () => {
      const textFile = showMission
        ? page.mission?.instructions
        : page.script;

      if (!textFile || !assets[textFile]) {
        setScriptText("");
        return;
      }

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
      if (audioRef.current) {
        audioRef.current.play().catch((e) => {
          console.warn("자동 재생 실패(브라우저 정책):", e);
        });
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [page.tts, assets]);

  // TTS 종료 감지
  useEffect(() => {
    setIsAudioEnded(false);

    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsAudioEnded(true);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [page.tts, assets]);
  // ✅ 상태 추적용 로그
useEffect(() => {
  console.log("🧪 상태 변화 추적 >>>", {
    missionComplete,
    missionReady,
    showMission,
    isAudioEnded,
    currentPage,
  });
}, [missionComplete, missionReady, showMission, isAudioEnded, currentPage]);

  // TTS 끝난 후 미션 준비 상태로 전환
  useEffect(() => {
    if (hasMission && isAudioEnded && !showMission) {
      setMissionReady(true);
    }
  }, [hasMission, isAudioEnded, showMission]);



  // 다음 버튼 클릭 처리
  const handleNext = () => {
    // 1. 미션 준비 상태면 → 미션 진입
    if (missionReady && !showMission) {
      setShowMission(true);
      setMissionReady(false);
      return;
    }

    // 2. 미션 중이면 → 미션 완료되어야 넘어감
    if (showMission && !missionComplete) return;

    // 3. 다음 페이지로 이동
    setCurrentPage((prev) => prev + 1);
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);
  };

  // 이전 버튼
  const handlePrevious = () => {
    if (currentPage === 0) return;
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-2">{page.id}</h2>

      {/* 삽화 또는 미션 */}
      {showMission && MissionComponent ? (
        <MissionComponent
        onComplete={() => {
          setMissionComplete(true);
      
          // 살짝 딜레이를 주고 버튼 상태 변화 기다리기
          setTimeout(() => {
            console.log("✅ 미션 완료 후 상태 갱신 완료");
          }, 100); // 100ms 후 다음 렌더에서 버튼 조건 적용됨
        }}
      />
      ) : (
        <SingleStoryIllustration src={assets[page.illustration]} />
      )}

      {/* TTS 오디오 */}
      {page.tts && (
        <audio ref={audioRef} src={assets[page.tts]} style={{ display: "none" }} />
      )}

      {/* 효과음 */}
      {page.sounds && page.sounds.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {page.sounds.map((soundFile, idx) => (
            <audio key={idx} controls src={assets[soundFile]} />
          ))}
        </div>
      )}

      {/* 대사 */}
      {scriptText && (
        <div className="mt-6 px-6 py-4 rounded-lg max-w-4xl text-center text-4xl font-whitechalk whitespace-pre-line">
          {scriptText}
        </div>
      )}

      {/* 이전 버튼 */}
      {currentPage > 0 && (
        <img
          src={pagePreviousButton}
          alt="이전"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-24 h-24 cursor-pointer"
        />
      )}

      {/* 다음 버튼 */}
      {currentPage < story.length - 1 && (
        <img
          src={pageNextButton}
          alt="다음"
          onClick={handleNext}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-24 h-24 cursor-pointer transition-opacity duration-300 ${
            (!hasMission && isAudioEnded) ||
            (missionReady && !showMission) ||
            (showMission && missionComplete)
              ? "opacity-100 animate-blinkTwice brightness-110"
              : "opacity-30 pointer-events-none grayscale"
          }`}
        />
      )}
    </div>
  );
};

export default SingleStoryRenderer;

