import React, { useState, useEffect } from 'react';

function StoryDialogue({ storyData }) {
  const [scriptText, setScriptText] = useState(""); // 스크립트 텍스트 상태
  const [audioSrc, setAudioSrc] = useState(null); // 일반 오디오 소스 상태
  const [ttsAudioSrc, setTtsAudioSrc] = useState(null); // TTS 오디오 소스 상태
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // 일반 오디오 재생 상태
  const [isTtsPlaying, setIsTtsPlaying] = useState(false); // TTS 오디오 재생 상태

  useEffect(() => {
    if (storyData?.audio) {
      setAudioSrc(storyData.audio); // 일반 오디오 소스 설정
    }
    if (storyData?.tts) {
      setTtsAudioSrc(storyData.tts); // TTS 오디오 소스 설정
    }
  }, [storyData]);

  useEffect(() => {
    const fetchScript = async () => {
      if (!storyData?.textFile && !storyData?.scriptFile) {
        setScriptText("대사 파일이 없습니다.");
        return;
      }

      try {
        const scriptUrl = storyData.scriptFile || storyData.textFile;
        if (!scriptUrl) {
          throw new Error("대사 파일 URL이 없습니다.");
        }

        const res = await fetch(scriptUrl);
        if (!res.ok) { 
          throw new Error(`HTTP error! status: ${res.status}`);
        }
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
    if (ttsAudioSrc) {
      setTimeout(() => {
        const ttsAudio = new Audio(ttsAudioSrc);
        ttsAudio.play();
        setIsTtsPlaying(true);
      }, 1000); // 1초 후에 자동 재생
    }
  }, [ttsAudioSrc]);

  useEffect(() => {
    if (ttsAudioSrc) {
      const ttsAudio = new Audio(ttsAudioSrc);
      ttsAudio.onplay = () => {
        setIsTtsPlaying(true);
      };
      ttsAudio.onpause = () => {
        setIsTtsPlaying(false);
      };
      ttsAudio.onended = () => {
        setIsTtsPlaying(false);
      };

      return () => {
        ttsAudio.pause();
        ttsAudio.currentTime = 0;
      };
    }
  }, [isTtsPlaying, ttsAudioSrc]);

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
