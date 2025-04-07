// import React, { useRef, useEffect } from "react";
// import { useTrackingCore } from "../../hooks/useTrackingCore";
// import { useDrawStarMission } from "../../hooks/useDrawStarMission";
// import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
// import CountdownOverlay from "../webcam/CountdownOverlay";
// import { useMemo } from "react";

// const WebcamDrawMission = ({
//   missionProps,
//   assets,
//   onComplete,
//   fairytalePk = 1,
//   setStatusContent
// }) => {
//   const videoRef = useRef(null);
//   const {
//     handLandmarks,
//     previewUrl,
//     showModal,
//     countdown,
//     setShowModal,
//     handleSave,
//   } = useTrackingCore(videoRef, fairytalePk);

//   const keyGuideImageKey = missionProps.instructionImages?.[0];
//   const backgroundImageKey = missionProps.instructionImages?.[1];
//   const keyGuideImage = assets[keyGuideImageKey];
//   const backgroundImage = assets[backgroundImageKey];

//   // console.log("🧩 keyGuideImageKey:", keyGuideImageKey);
//   // console.log("🧩 backgroundImageKey:", backgroundImageKey);
//   // console.log("🖼️ keyGuideImage URL:", keyGuideImage);
//   // console.log("🖼️ backgroundImage URL:", backgroundImage);

//   const {
//     canvasRef,
//     drawCanvas,
//     updateDrawing,
//     progress,
//   } = useDrawStarMission(480, 350, backgroundImage, onComplete);

//   // 진행률 상태 UI 전달
//   useEffect(() => {
//     if (!setStatusContent) return;
//     const ui = (
//       <div className="w-full flex flex-col items-center gap-2">
//         <div className="text-xl font-cafe24 text-brown-800">진행률: {progress}%</div>
//         <div className="w-72 h-4 bg-gray-300 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-green-400 transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>
//     );
//     setStatusContent(ui);
//   }, [progress, setStatusContent]);

//   useEffect(() => {
//     if (!handLandmarks || handLandmarks.length < 9) return;
//     const tip = {
//       x: handLandmarks[8].x * 480,
//       y: handLandmarks[8].y * 350,
//     };
//     const pip = handLandmarks[6];
//     const isDrawing = handLandmarks[8].y < pip.y - 0.02;
//     updateDrawing(tip, isDrawing);
//   }, [handLandmarks]);

//   useEffect(() => {
//     drawCanvas();
//   }, [drawCanvas]);

//   return (
//     <div id="capture-container" className="relative flex flex-col items-center gap-4">
//       <div className="flex gap-8">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           className="rounded-lg w-[480px] h-[350px] scale-x-[-1]"
//         />
//         <canvas
//           ref={canvasRef}
//           width={480}
//           height={360}
//           className=" rounded-lg"
//         />
//       </div>

//       {/* {keyGuideImage && (
//         <img
//           src={keyGuideImage}
//           alt="key guide"
//           className="absolute top-4 left-4 w-24 h-24 z-30"
//         />
//       )} */}

//       {countdown !== null && <CountdownOverlay count={countdown} />}
//       <PhotoCaptureModal
//         isOpen={showModal}
//         previewUrl={previewUrl}
//         onSave={handleSave}
//         onClose={() => setShowModal(false)}
//       />
//     </div>
//   );
// };

// export default WebcamDrawMission;


import React, { useRef, useEffect, useMemo } from "react";
import { useTrackingCore } from "../../hooks/useTrackingCore";
import { useDrawStarMission } from "../../hooks/useDrawStarMission";
import PhotoCaptureModal from "../webcam/PhotoCaptureModal";
import CountdownOverlay from "../webcam/CountdownOverlay";

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
  } = useDrawStarMission(480, 350, backgroundImage, onComplete);

  // ✅ 진행률 상태 UI를 useMemo로 안정화
  const progressStatusUI = useMemo(() => {
    return (
      <div className="w-full flex justify-center">
        <div className="w-72 h-6 bg-gray-300 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-green-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
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
      y: handLandmarks[8].y * 350,
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
      <div className="flex gap-8">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-lg w-[480px] h-[350px] scale-x-[-1]"
        />
        <canvas
          ref={canvasRef}
          width={480}
          height={370}
          className=" rounded-lg"
        />
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
    </div>
  );
};

export default WebcamDrawMission;
