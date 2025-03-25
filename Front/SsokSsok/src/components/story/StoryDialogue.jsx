import React, { useState, useEffect } from 'react';

function StoryDialogue({ storyData }) {
  // 대사 텍스트 상태
  const [scriptText, setScriptText] = useState(""); 
  // 오디오 소스 상태
  const [audioSrc, setAudioSrc] = useState(null); 

  useEffect(() => {
    const fetchScript = async () => {
      if (!storyData.scriptFile) {
        setScriptText("");
        return;
      }

      try {
        const res = await fetch(storyData.scriptFile);
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
    if (storyData.audio) {
      setAudioSrc(storyData.audio); // 오디오 소스 설정
    }
  }, [storyData]);

  return (
    <div className="font-cafe24 text-lg text-center">
      {scriptText && (
        <div className="mt-6 bg-white px-6 py-4 rounded-lg shadow max-w-2xl text-center text-lg font-cafe24 whitespace-pre-line">
          {scriptText}
        </div>
      )}
      {audioSrc && (
        <audio controls>
          <source src={audioSrc} type="audio/mp3" />
        </audio>
      )}
    </div>
  );
}

export default StoryDialogue;
