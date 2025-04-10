import React, { useRef, useEffect, useMemo } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { useDrawStarMission } from "../../hooks/useDrawStarMission";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import CountdownOverlay from "../webcam/CountdownOverlay";
import CustomAlert from "../CustomAlert";


const WebcamDrawMission = ({
  missionProps,
  assets,
  onComplete,
  fairytalePk = 1,
  setStatusContent
}) => {
  const videoRef = useRef(null);
  const {
    handLandmarks,
    previewUrl,
    showModal,
    countdown,
    setShowModal,
    handleSave,
    alertMessage,        // ⬅️ 추가
    setAlertMessage,
  } = useTrackingCore(videoRef, fairytalePk);

  const keyGuideImageKey = missionProps.instructionImages?.[0];
  const backgroundImageKey = missionProps.instructionImages?.[1];
  const keyGuideImage = assets[keyGuideImageKey];
  const backgroundImage = assets[backgroundImageKey];

  const {
    canvasRef,
    drawCanvas,
    updateDrawing,
    progress,
    starPoints,
  } = useDrawStarMission(480, 370, backgroundImage, onComplete);

  

  // ✅ 진행률 상태 UI를 useMemo로 안정화
  const progressStatusUI = useMemo(() => {
    return (
      <div className="w-full flex justify-center">
        <div className="w-80 h-8 bg-gray-300 rounded-full overflow-hidden relative shadow-inner border border-gray-400">
  <div
    className="h-full bg-green-500 transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
  <div className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-white drop-shadow-sm tracking-wider">
    {progress}%
  </div>
</div>
      </div>
    );
  }, [progress]);

  // ✅ 안정화된 JSX만 setStatusContent로 넘김
  useEffect(() => {
    setStatusContent?.(progressStatusUI);
  }, [progressStatusUI, setStatusContent]);

  useEffect(() => {
    if (!handLandmarks || handLandmarks.length < 9) return;
    const tip = {
      x: handLandmarks[8].x * 480,
      y: handLandmarks[8].y * 380,
    };
    const pip = handLandmarks[6];
    const isDrawing = handLandmarks[8].y < pip.y - 0.02;
    updateDrawing(tip, isDrawing);
  }, [handLandmarks]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const completedRef = useRef(false);

useEffect(() => {
  if (progress >= 100 && !completedRef.current) {
    completedRef.current = true;
    onComplete?.();
  }
}, [progress, onComplete]);


  return (
    <div id="capture-container" className="relative flex flex-col items-center gap-4">

       {/* ✨ 안내 메시지 */}
       {progress < 100 && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 
                          bg-[#8B5E3C] text-white font-cafe24 text-2xl 
                          px-8 py-3 rounded-md border-4 border-stone-900 
                          shadow-lg tracking-wide z-50 pointer-events-none">
            🌟 1번부터 천천히 따라 그려보세요!
          </div>
        )}

      <div className="flex gap-8">
        <video
          ref={videoRef}
          autoPlay
          muted
          className={`rounded-lg w-[480px] h-[380px] scale-x-[-1] transition-opacity duration-300
            ${showModal ? "opacity-0" : "opacity-100"}`}
        />
        <canvas
          ref={canvasRef}
          width={480}
          height={380}
          className=" rounded-lg"
        />
        {starPoints.slice(0, 10).map((p, i) => (
  <div
    key={`point-${i}`}
    className="absolute w-6 h-6 rounded-full border border-white bg-white/20 backdrop-blur-sm text-xs flex items-center justify-center text-white font-semibold"
    style={{
      left: `${480 - p.x}px`,
      top: `${p.y - 6}px`,
      transform: "translate(-50%, -50%)",
      zIndex: 30,
    }}
  >
    {i + 1}
  </div>
  ))}

      </div>

      {/* {keyGuideImage && (
        <img
          src={keyGuideImage}
          alt="key guide"
          className="absolute top-4 left-4 w-24 h-24 z-30"
        />
      )} */}

      {countdown !== null && <CountdownOverlay count={countdown} />}
      <PhotoCaptureModal
        isOpen={showModal}
        previewUrl={previewUrl}
        onSave={handleSave}
        onClose={() => setShowModal(false)}
      />

      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </div>
  );
};

export default WebcamDrawMission;
