import React, { useState, useEffect, useRef } from "react";
import pageNextButton from "../../assets/images/pagenext_icon.png";
import pagePreviousButton from "../../assets/images/pageprevious_icon.png";
import StoryPage from "../single/StoryPage";

const SingleStoryRenderer = ({ story, assets }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [missionReady, setMissionReady] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const audioRef = useRef(null);
  const [isAudioEnded, setIsAudioEnded] = useState(false);
  const [missionOriginPage, setMissionOriginPage] = useState(null);

  if (!story || !story.length) {
    return <div className="text-center font-bold mt-10">스토리 없음 😥</div>;
  }

  const page = story[currentPage];
  const hasMission = !!page.mission;

  // TTS + 효과음(sounds) 자동 재생
useEffect(() => {
  if (page.sounds && Array.isArray(page.sounds)) {
    page.sounds.forEach((soundFile) => {
      const soundUrl = assets[soundFile];
      if (soundUrl) {
        const audio = new Audio(soundUrl);
        audio.play().catch(() => {});
      }
    });
  }

  if (!page.tts || !assets[page.tts]) return;
  const timeout = setTimeout(() => {
    audioRef.current?.play().catch(() => {});
  }, 1000);
  return () => clearTimeout(timeout);
}, [page.tts, assets, page.sounds]);

  // // TTS 자동 재생
  // useEffect(() => {
  //   if (!page.tts || !assets[page.tts]) return;
  //   const timeout = setTimeout(() => {
  //     audioRef.current?.play().catch(() => {});
  //   }, 1000);
  //   return () => clearTimeout(timeout);
  // }, [page.tts, assets]);


  // 오디오 종료 감지
  useEffect(() => {
    setIsAudioEnded(false);
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsAudioEnded(true);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [page.tts]);

  // 미션 진입 가능 여부
  useEffect(() => {
    if (hasMission && isAudioEnded && !showMission) {
      setMissionReady(true);
    }
  }, [hasMission, isAudioEnded, showMission]);

  // 다음 페이지
  const handleNext = () => {
    if (missionReady && !showMission) {
      setMissionOriginPage(currentPage); // ⭐ 미션 진입 전에 현재 페이지 저장
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

  // 이전 페이지
  const handlePrevious = () => {
    // 🎯 미션 상태에서 나가면 저장해둔 페이지로 돌아감
    if (showMission) {
      if (missionOriginPage !== null) {
        setCurrentPage(missionOriginPage);
      }
      setShowMission(false);
      setMissionComplete(false);
      setMissionReady(false);
      setIsAudioEnded(false);
      return;
    }
  
    if (currentPage === 0) return;
    setCurrentPage((prev) => prev - 1);
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);
  };

  

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-4 mt-3">
      <StoryPage
        page={page}
        showMission={showMission}
        assets={assets}
        onMissionComplete={() => setMissionComplete(true)}
      />

      {/* TTS */}
      {page.tts && (
        <audio ref={audioRef} src={assets[page.tts]} style={{ display: "none" }} />
      )}

    

      {/* 페이지 네비게이션 */}
      <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none">
        {currentPage > 0 ? (
          <img
            src={pagePreviousButton}
            alt="이전 페이지"
            onClick={handlePrevious}
            className="w-20 h-20 cursor-pointer pointer-events-auto"
          />
        ) : (
          <div className="w-20 h-20" />
        )}

        {/* {currentPage < story.length - 1 ? (
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
          <div className="w-20 h-20" />
        )} */}
        {currentPage < story.length - 1 ? (
            <img
              src={pageNextButton}
              alt="다음 페이지"
              onClick={
                (!hasMission && isAudioEnded) ||
                (missionReady && !showMission) ||
                (showMission && missionComplete)
                  ? handleNext
                  : undefined // ❌ 클릭 못하게 함
              }
              className={`w-20 h-20 cursor-pointer transition-opacity duration-300 ${
                (!hasMission && isAudioEnded) ||
                (missionReady && !showMission) ||
                (showMission && missionComplete)
                  ? "opacity-100 animate-blinkTwice brightness-110 pointer-events-auto"
                  : "opacity-30 grayscale pointer-events-none"
              }`}
            />
          ) : (
            <div className="w-20 h-20" />
          )}
      </div>
    </div>
  );
};

export default SingleStoryRenderer;
