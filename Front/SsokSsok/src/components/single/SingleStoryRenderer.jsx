import React, { useState, useEffect } from "react";

const SingleStoryRenderer = ({ story, assets }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [scriptText, setScriptText] = useState("");

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
        setScriptText(text);
      } catch (e) {
        console.error("📛 대사 파일 로딩 실패:", e);
        setScriptText("❌ 대사를 불러올 수 없습니다.");
      }
    };

    fetchText();
  }, [page.textFile, assets]);

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-4">{page.id}</h2>

      {/* 삽화 이미지 */}
      {page.image && (
        <img
          src={assets[page.image]}
          alt="illustration"
          className="w-[40rem] mb-4"
        />
      )}

      {/* TTS 오디오 */}
      {page.tts && (
        <audio controls src={assets[page.tts]} className="mb-4" />
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
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-6 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
        >
          ⬅️ 이전
        </button>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, story.length - 1))
          }
          disabled={currentPage === story.length - 1}
          className="px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          ➡️ 다음
        </button>
      </div>
    </div>
  );
};

export default SingleStoryRenderer;
