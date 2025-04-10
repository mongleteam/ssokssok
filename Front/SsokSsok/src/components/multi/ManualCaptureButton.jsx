import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { playShutterSound } from "../../utils/playShutterSound";
import { sendThumbImage } from "../../apis/bookStartApi";

const ManualCaptureButton = ({ captureTargetRef }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const startCountdownAndCapture = async () => {
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);
    await new Promise((r) => setTimeout(r, 300));

    playShutterSound?.();

    if (captureTargetRef.current) {
      const canvas = await html2canvas(captureTargetRef.current);
      const url = canvas.toDataURL("image/png");
      setPreviewUrl(url);
      setShowModal(true);
    }
  };

  const handleSave = async () => {
    const res = await fetch(previewUrl);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "capture.png");
    formData.append("fairytalePk", 1); // 일단 헨젤과 그레텔 pk 1로 고정
  
    try {
      await sendThumbImage(formData);
    //   alert("✅ 저장 완료!");
    } catch (err) {
      console.error("❌ 저장 실패:", err);
    }
  
    setShowModal(false);
    setPreviewUrl(null);
  };

  return (
    <>
      <button
        onClick={startCountdownAndCapture}
        className="absolute top-2 right-2 z-50 bg-white rounded-full p-2 text-black shadow-md hover:scale-105 transition"
      >
        📸 촬영
      </button>

      {countdown && (
        <div className="absolute top-10 right-10 z-50 text-5xl text-white font-bold">
          {countdown}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl mb-4">사진 미리보기</h2>
            <img src={previewUrl} alt="캡처된 이미지" className="w-80 mx-auto mb-4" />
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowModal(false)}>닫기</button>
              <button onClick={handleSave}>저장</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManualCaptureButton;
