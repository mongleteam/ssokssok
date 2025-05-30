import React, { useState } from "react";
import html2canvas from "html2canvas";
import { playShutterSound } from "../../utils/playShutterSound";
import { sendThumbImage } from "../../apis/bookStartApi";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal"; // 여기에 연결
import CustomAlert from "../CustomAlert";

const ManualCaptureButton = ({ captureTargetRef, fairytalePk }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // 추가
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


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
    formData.append("fairytalePk", 1);

    try {
      await sendThumbImage(formData);
      setAlertMessage("📸 사진이 저장되었습니다! 나만의 앨범에서 확인해보세요.");
      setShowAlert(true);
    } catch (err) {
      console.error(err);
    }

    setShowModal(false);
    setPreviewUrl(null);
  };

  return (
    <>
      {/* 촬영 버튼 */}
      <div
        className="absolute top-4 right-4 z-50 flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 툴팁 (왼쪽) */}
        {isHovered && (
          <div className="relative mr-2">
            <div className="px-3 py-1 bg-white text-black rounded-lg shadow text-sm font-cafe24 animate-fade-in">
              함께 추억을 남겨보세요! 3초 후 찰칵!
            </div>
            <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white" />
          </div>
        )}

        {/* 카운트다운 표시 */}
        {countdown && (
          <div className="ml-3 px-3 py-1 bg-white text-black rounded-full font-cafe24 text-2xl animate-fade-in">
            {countdown}
          </div>
        )}

        {/* 버튼 */}
        <button
          onClick={startCountdownAndCapture}
          className="rounded-full p-1 text-black hover:scale-110 transition font-cafe24 text-5xl"
        >
          📸
        </button>

      </div>


      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}

    </>
  );
};

export default ManualCaptureButton;
