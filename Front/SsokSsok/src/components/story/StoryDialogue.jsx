import React, { useState, useEffect, useRef } from 'react';
import { Repeat } from "lucide-react";

function StoryDialogue({ storyData }) {
  const [scriptText, setScriptText] = useState("");
  const [isTtsEnded, setIsTtsEnded] = useState(false);
  const audioRef = useRef(null); // ✅ 오디오 저장용 ref

  useEffect(() => {
    const fetchScript = async () => {
      if (!storyData?.textFile && !storyData?.scriptFile) {
        setScriptText("대사 파일이 없습니다.");
        return;
      }

      try {
        const scriptUrl = storyData.scriptFile || storyData.textFile;
        const res = await fetch(scriptUrl);
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

    const ttsAudio = new Audio(storyData.tts);
    audioRef.current = ttsAudio;

    const timeout = setTimeout(() => {
      ttsAudio.play();
    }, 1000);

    ttsAudio.onended = () => {
      if (storyData.soundFiles?.length === 1) {
        playSoundEffects([...storyData.soundFiles]);
      } else {
        setIsTtsEnded(true);
      }
    };

    const playSoundEffects = (files) => {
      if (files.length === 0) {
        setIsTtsEnded(true);
        return;
      }

      const effectAudio = new Audio(files[0]);
      audioRef.current = effectAudio;
      effectAudio.play();
      effectAudio.onended = () => playSoundEffects(files.slice(1));
    };

    return () => {
      clearTimeout(timeout);
      ttsAudio.pause();
      ttsAudio.currentTime = 0;
    };
  }, [storyData]);

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    const replayAudio = new Audio(storyData.tts);
    audioRef.current = replayAudio;
  
    replayAudio.play().catch((err) => {
      console.error("다시 듣기 재생 실패:", err);
    });
  };

  return (
      <div className="relative flex items-center justify-center font-whitechalk text-3xl text-center w-full h-full flex-col">
      {scriptText && (
        <div className="m-4 px-6 py-4 max-w-2xl text-center whitespace-pre-line">
          {scriptText}
        </div>
      )}

      {/* ✅ 다시 듣기 버튼 - 애니메이션 포함 */}
      {isTtsEnded && (
        <button
        onClick={handleReplay}
        className="absolute top-4 right-4 p-2 transition hover:scale-110 group"
        title="다시 듣기"
      >
        <Repeat className="w-5 h-5 text-black" />
      </button>
      )}
    </div>
  );
}

export default StoryDialogue;
