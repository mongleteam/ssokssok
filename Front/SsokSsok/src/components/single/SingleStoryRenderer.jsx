import React, { useState, useEffect, useRef} from "react";
import pageNextButton from "../../assets/images/pagenext_icon.png";
import pagePreviousButton from "../../assets/images/pageprevious_icon.png";
import StoryPage from "../single/StoryPage";
import { updateSingleProgressApi } from "../../apis/singleApi";
import pauseBtn from "../../assets/images/btn_pause.png";
import { useNavigate } from "react-router-dom";
import PauseModal from "../story/PauseModal";
import CompleteModal from "../story/CompleteModal";

const SingleStoryRenderer = ({ story, assets, progressPk, totalPageCount,  nowPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(nowPage - 1); // nowPage는 1-based니까 -1
  const [missionReady, setMissionReady] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);
  const audioRef = useRef(null);
  const [isAudioEnded, setIsAudioEnded] = useState(false);
  const [missionOriginPage, setMissionOriginPage] = useState(null);
  const [ttsKey, setTtsKey] = useState(0); // TTS 강제 재실행용
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // console.log("🥩 progressPk값:", progressPk)
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
}, [page.tts, assets, page.sounds, currentPage]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!page.tts || !assets[page.tts] || !audio) return;
  
    setIsAudioEnded(false); // 재생 전 초기화
  
    audio.src = assets[page.tts];
    audio.load();
  
    const timeout = setTimeout(() => {
      audio.play().catch(() => {});
    }, 500);
  
    const handleEnded = () => setIsAudioEnded(true);
    audio.addEventListener("ended", handleEnded);
  
    return () => {
      clearTimeout(timeout);
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentPage, ttsKey]); // ttsKey가 바뀌면 재실행
  

  // 미션 진입 가능 여부
  useEffect(() => {
    if (hasMission && isAudioEnded && !showMission) {
      setMissionReady(true);
    }
  }, [hasMission, isAudioEnded, showMission]);

  // 다음 페이지
  const handleNext = async () => {
    if (missionReady && !showMission) {
      setMissionOriginPage(currentPage); // ⭐ 미션 진입 전에 현재 페이지 저장
      setShowMission(true);
      setMissionReady(false);
      return;
    }
    if (showMission && !missionComplete) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);

    // 진행사항 업데이트 api
    if (progressPk) {
      try {
        const isLast = nextPage + 1 === totalPageCount;
        console.log("📌 저장 호출:", {
          progressPk,
          nowPage: nextPage + 1,
          finish: isLast,
        });
        
        await updateSingleProgressApi(progressPk, {
          nowPage: nextPage + 1,
          finish: isLast,
        });
        console.log("📌 싱글 진행도 저장됨:", nextPage + 1, `(finish: ${isLast})`);
      } catch (err) {
        console.error("❌ 싱글 진행도 저장 실패:", err);
      }
    }
  };

  

  // 이전 페이지
  const handlePrevious = () => {
    // 🎯 미션 상태에서 나가면 저장해둔 페이지로 돌아감
    if (showMission) {
      if (missionOriginPage !== null) {
        setCurrentPage(missionOriginPage);
        setTtsKey((prev) => prev + 1); // 🔥 TTS 재실행
      }
      setShowMission(false);
      setMissionComplete(false);
      setMissionReady(false);
      setIsAudioEnded(false);
      return;
    }
  
    if (currentPage === 0) return;
    setCurrentPage((prev) => prev - 1);
    setTtsKey((prev) => prev + 1); // 🔥 이전 페이지로도 TTS 재실행
    setShowMission(false);
    setMissionComplete(false);
    setMissionReady(false);
    setIsAudioEnded(false);
  };

  const navigate = useNavigate();

  const handleQuit = async () => {
    const nowPage = currentPage + 1; // 1-based
    const isLast = nowPage === totalPageCount;

    if (progressPk) {
      try {
        await updateSingleProgressApi(progressPk, {
          nowPage,
          finish: isLast,
        });
        console.log("✅ 그만읽기: 진행 저장 완료!");
      } catch (err) {
        console.error("❌ 진행 저장 실패:", err);
      }
    }

    navigate("/main"); // 메인으로 이동
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

      {isCompleteModalOpen && (
        <div>
          <CompleteModal />
        </div>
      )}

      {isPauseModalOpen && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <PauseModal />
        </div>
      )}

      <button
        onClick={() => {
          if (currentPage === story.length - 1) {
            setIsCompleteModalOpen(true);
          } else {
            setIsPauseModalOpen(true);
          }
        }}
        className="fixed bottom-8 right-8 z-10 w-52 h-20 font-cafe24 text-xl hover:scale-110 transition-transform duration-200"
      >
      <img
        src={pauseBtn}
        alt="그만 읽기"
        className="absolute inset-0 w-full h-full object-contain"
      />
      <span className="relative">
        {currentPage === story.length - 1 ? "읽기 완료" : "그만 읽기"}
      </span>
    </button>

    </div>
  );
};

export default SingleStoryRenderer;
