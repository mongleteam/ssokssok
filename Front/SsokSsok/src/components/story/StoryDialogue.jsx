import React, { useState, useEffect } from 'react';

function StoryDialogue({ storyData }) {
  const [scriptText, setScriptText] = useState(""); // 스크립트 텍스트 상태
  const [audioSrc, setAudioSrc] = useState(null); // 일반 오디오 소스 상태
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // 일반 오디오 재생 상태

  useEffect(() => {
    const fetchScript = async () => {
      if (!storyData?.textFile && !storyData?.scriptFile) {
        setScriptText("대사 파일이 없습니다.");
        return;
      }
  
      try {
        const scriptUrl = storyData.scriptFile || storyData.textFile;
        const res = await fetch(scriptUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        setScriptText(text);
      } catch (e) {
        console.error("대사 파일 로딩 실패:", e);
        setScriptText("대사를 불러올 수 없습니다.");
      }
    };
  
    fetchScript();
  }, [storyData]);
  

  useEffect(() => {
    if (!storyData?.tts) return;
  
    const audio = new Audio(storyData.tts);
    const timeout = setTimeout(() => {
      audio.play();
    }, 1000);
  
    return () => {
      clearTimeout(timeout);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [storyData]);
  
  

  return (
    <div className="flex items-center justify-center font-whitechalk text-3xl text-center w-full h-full">
      {/* 스크립트 텍스트 출력 */}
      {scriptText && (
        <div className="m-4 px-6 py-4 max-w-2xl text-center whitespace-pre-line">
          {scriptText}
        </div>
      )}
      
      {/* TTS 오디오 플레이어 */}
      {/* <audio controls src={ttsAudioSrc} /> */}

      {/* {ttsAudioSrc && (
        <button onClick={() => {
          const ttsAudio = new Audio(ttsAudioSrc);
          if (isTtsPlaying) {
            ttsAudio.pause();
            setIsTtsPlaying(false);
          } else {
            ttsAudio.play();
            setIsTtsPlaying(true);
          }
        }}>
          {isTtsPlaying ? "일시 정지" : "다시 듣기"}
        </button>
      )} */}
    </div>
  );
}

export default StoryDialogue;
