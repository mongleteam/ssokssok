import React, { useState } from "react";
import html2canvas from "html2canvas";
import { playShutterSound } from "../../utils/playShutterSound";
import { sendThumbImage } from "../../apis/bookStartApi";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal"; // ✅ 여기에 연결

const ManualCaptureButton = ({ captureTargetRef, fairytalePk }) => {
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
    formData.append("fairytalePk", fairytalePk);

    try {
      await sendThumbImage(formData);
    } catch (err) {
      console.error(err);
    }

    setShowModal(false);
    setPreviewUrl(null);
  };

  return (
    <>
      <button
        onClick={startCountdownAndCapture}
        className="absolute top-0 right-2 z-50 bg-white rounded-full p-2 text-black shadow-md hover:scale-105 transition"
      >
        📸 촬영
      </button>

      {countdown && (
        <div className="absolute top-10 right-10 z-50 text-5xl text-white font-bold">
          {countdown}
        </div>
      )}

      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ManualCaptureButton;
