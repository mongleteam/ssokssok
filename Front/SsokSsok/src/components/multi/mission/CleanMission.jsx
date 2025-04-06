import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const CleanMissionMulti = ({
  missionData,
  assets,
  onSuccess,
  publisher,
  roomId,
  userName,
  from,
  setStatusContent,
}) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const broomRef = useRef(null);

  const [motionCount, setMotionCount] = useState(0);
  const countRef = useRef(0);
  const motionRef = useRef({
    startX: null,
    movedLeft: false,
    movedRight: false,
  });

  const broomImg = assets[missionData.instructionImages?.[0]];
  const dustImg1 = assets[missionData.instructionImages?.[1]];
  const dustImg2 = assets[missionData.instructionImages?.[2]];
  const dustImg3 = assets[missionData.instructionImages?.[3]];

  const renderDust = () => {
    if (motionCount === 0) return dustImg3;
    if (motionCount === 1) return dustImg2;
    if (motionCount === 2) return dustImg1;
    return null;
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // ✅ 현재 실제 div 크기로 설정 (깨짐 방지)
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const wrist = landmarks[0];
        if (!wrist) return;

        const currentX = wrist.x;
        const sensitivity = 0.1;

        if (motionRef.current.startX === null) {
          motionRef.current.startX = currentX;
          return;
        }

        const deltaX = currentX - motionRef.current.startX;

        if (deltaX > sensitivity && !motionRef.current.movedRight) {
          motionRef.current.movedRight = true;
          motionRef.current.startX = currentX;
        } else if (deltaX < -sensitivity && !motionRef.current.movedLeft) {
          motionRef.current.movedLeft = true;
          motionRef.current.startX = currentX;
        }

        if (motionRef.current.movedLeft && motionRef.current.movedRight) {
          countRef.current += 1;
          setMotionCount(countRef.current);
          motionRef.current = {
            startX: currentX,
            movedLeft: false,
            movedRight: false,
          };
        }

        // ✅ 빗자루 따라다니기
        if (broomRef.current) {
          broomRef.current.style.left = `${(1 - wrist.x) * 100}%`;
          broomRef.current.style.top = `${wrist.y * 100}%`;
        }
      }
    });

    const setupCamera = async () => {
      if (videoRef.current && publisher?.stream) {
        const mediaStream = publisher.stream.getMediaStream();
        videoRef.current.srcObject = mediaStream;

        try {
          await videoRef.current.play();
          const camera = new Camera(videoRef.current, {
            onFrame: async () => await hands.send({ image: videoRef.current }),
            width: 640,
            height: 480,
          });
          camera.start();
        } catch (err) {
          console.error("🎥 Video play error:", err);
        }
      }
    };

    setupCamera();
  }, [publisher]);

  useEffect(() => {
    if (motionCount >= 3) {
      onSuccess?.();
    }
  }, [motionCount]);

  useEffect(() => {
    if (!setStatusContent) return;
    const ui = (
      <div className="text-3xl font-cafe24 font-bold text-blue-700 text-center animate-bounce">
        청소 진행률: {motionCount} / 3
      </div>
    );
    setStatusContent(ui);
  }, [motionCount]);

  return (
    <div className="relative w-full h-full max-w-[30rem] aspect-video torn-effect overflow-hidden">
      {/* 🎥 영상 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-auto object-cover scale-x-[-1]"
      />

      {/* 💨 먼지 */}
      {renderDust() && (
        <img
          src={renderDust()}
          alt="dust"
          className="absolute top-20 right-0 w-[10rem] object-cover z-10 pointer-events-none"
        />
      )}

      {/* 🧹 빗자루 */}
      {broomImg && (
        <img
          ref={broomRef}
          src={broomImg}
          alt="broom"
          className="absolute w-40 h-40 pointer-events-none z-20 transition-transform duration-75"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* 🖐️ 디버깅용 캔버스 */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
    </div>
  );
};

export default CleanMissionMulti;
