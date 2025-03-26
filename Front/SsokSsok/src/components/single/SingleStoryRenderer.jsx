import React, { useState, useEffect, useRef } from "react";
import pageNextButton from "../../assets/images/pagenext_icon.png";
import pagePreviousButton from "../../assets/images/pageprevious_icon.png";
import SingleStoryIllustration from "../single/SingleStoryIllustration";
import { animate } from "framer-motion";

const SingleStoryRenderer = ({ story, assets }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [scriptText, setScriptText] = useState("");
  const audioRef = useRef(null);
  const [ isAudioEnded, setIsAudioEnded ] = useState(false); // tts 재생 상태 추가 

  if (!story || !story.length) {
    return <div className="text-center font-bold mt-10">스토리 없음 😢</div>;
  }

  const page = story[currentPage];

  // 텍스트 파일도 assets에서 직접 fetch해서 표시
  useEffect(() => {
    const fetchText = async () => {
      if (!page.textFile || !assets[page.textFile]) {
        setScriptText("");
        return;
      }

      try {
        const res = await fetch(assets[page.textFile]);
        const text = await res.text();

        console.log("텍스트 파일 내용 : ", text)
        setScriptText(text);
      } catch (e) {
        console.error("📛 대사 파일 로딩 실패:", e);
        setScriptText("❌ 대사를 불러올 수 없습니다.");
      }
    };

    fetchText();
  }, [page.textFile, assets]);

  

  // tts 파일 자동 재생
  useEffect(() => {
    if (!page.tts || !assets[page.tts]) return;

    const timeout = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => {
          console.warn("자동 재새 실패(브라우저 정책):", e);
        });
      }
    }, 1200); //1.5초 뒤 자동 재생

    return () => clearTimeout(timeout); // 페이지 바뀔 때 이전 타이머 제거
  }, [page.tts, assets]);

  // tts 오디오 끝났는지 확인 위함 
  useEffect(() => {
    setIsAudioEnded(false); // 페이지 바뀔 때 초기화

    const audio = audioRef.current;
    if (!audio) return;

    const hadelEnded = () => {
      setIsAudioEnded(true);
    };

    audio.addEventListener("ended", hadelEnded);

    return () => {
      audio.removeEventListener("ended", hadelEnded);
    };
  }, [page.tts, assets]);



  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-4">{page.id}</h2>

      {/* 삽화 이미지 */}
      {page.image && (
    <div className="relative w-[50rem] h-auto torn-effect mb-4">
      <SingleStoryIllustration src={assets[page.image]} />
    </div>
    )}

      {/* TTS 오디오 */}
      {page.tts && (
        <audio
        ref = {audioRef} 
        src={assets[page.tts]} 
        style={{ display: "none"}} />
      )}

      {/* 효과음들 */}
      {page.sounds && page.sounds.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {page.sounds.map((soundFile, idx) => (
            <audio key={idx} controls src={assets[soundFile]} />
          ))}
        </div>
      )}

      {/* 📘 대사 텍스트 */}
      {scriptText && (
        <div className="mt-6 bg-white px-6 py-4 rounded-lg shadow max-w-2xl text-center text-lg font-cafe24 whitespace-pre-line">
          {scriptText}
        </div>
      )}

      {/* 페이지 이동 버튼 */}
      {/* 왼쪽 (이전) */}
      {currentPage > 0 && (
        <img
          src={pagePreviousButton}
          alt="이전"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-24 h-24 cursor-pointer"
        />
      )}

      {/* 오른쪽 (다음) */}
      {currentPage < story.length - 1 && (
        <img
          src={pageNextButton}
          alt="다음"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, story.length - 1))
          }
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-24 h-24 cursor-pointer transition-opacity duration-300 ${
            isAudioEnded
              ? "opacity-100 animate-blinkTwice brightness-110"
              : "opacity-30 pointer-events-none grayscale"
          }`}
        />
      )}

    </div>
  );
};

export default SingleStoryRenderer;
