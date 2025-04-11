import React, { useEffect, useRef, useState } from "react";
import * as handPose from "@mediapipe/hands";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { sendMessage, onSocketEvent, offSocketEvent } from "../../../services/socket";


const MAX_BREAD = 3;
const HOLD_DURATION = 2500;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;
const BREAD_SIZE = 96;

const HandHoldBreadOverlay = ({
  missionData,
  assets,
  onSuccess,
  publisher,
  roomId,
  userName,
  setStatusContent,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [breads, setBreads] = useState([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [fingerPos, setFingerPos] = useState(null);
  const heldBreadRef = useRef(null);
  const holdStartRef = useRef(null);

  const breadImg = missionData?.instructionImages?.[0];
  const bgImg = missionData?.instructionImages?.[1];
  const soundEffect = missionData?.soundEffect?.[0];

  useEffect(() => {
    if (!assets[breadImg]) return;

    const placed = [];
    const MIN_DISTANCE = 80;
    while (placed.length < MAX_BREAD) {
      const x = Math.random() * (CANVAS_WIDTH - 160) + 80;
      const y = Math.random() * (CANVAS_HEIGHT - 160) + 80;
      const mirroredX = CANVAS_WIDTH - x;
      const tooClose = placed.some((b) => {
        const dx = b.x - mirroredX;
        const dy = b.y - y;
        return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE;
      });
      if (!tooClose) {
        placed.push({ id: placed.length, x: mirroredX, y, collected: false });
      }
    }
    setBreads(placed);
  }, [assets, breadImg]);

  useEffect(() => {
    if (collectedCount > 0) {
      sendMessage("objectCount", {
        senderName: userName,
        roomId,
        objectCount: collectedCount,
      });
    }
  
    if (collectedCount === MAX_BREAD) {
      sendMessage("isSuccess", {
        senderName: userName,
        roomId,
        isSuccess: "성공",
      });
  
      // setStatusContent?.(
      //   <p className="text-lg font-bold">{userName}이 빵을 모두 찾았어요!</p>
      // );
  
      onSuccess?.();
    }
  }, [collectedCount]);

  useEffect(() => {
    const handleObjectCount = ({ senderName, objectCount }) => {
      if (senderName !== userName) {
        const text =
          objectCount < MAX_BREAD
            ? `${senderName}이 빵을 찾는 중... (${objectCount}/${MAX_BREAD})`
            : `${senderName}이 빵을 모두 찾았어요!`;
  
        setStatusContent?.(<p className="text-2xl font-bold text-blue-700 animate-pulse">{text}</p>);
      }
    };
  
    onSocketEvent("objectCount", handleObjectCount);
    return () => offSocketEvent("objectCount");
  }, [userName, roomId]);
  
  
  

  const updateBreadHold = (fingerPos) => {
    const now = Date.now();
    let found = null;

    for (const bread of breads) {
      if (bread.collected) continue;
      const centerX = bread.x + BREAD_SIZE / 2;
      const centerY = bread.y + BREAD_SIZE / 2;
      const dx = centerX - fingerPos.x;
      const dy = centerY - fingerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        found = bread;
        break;
      }
    }

    if (found) {
      if (!heldBreadRef.current || heldBreadRef.current.id !== found.id) {
        heldBreadRef.current = found;
        holdStartRef.current = now;
      } else if (now - holdStartRef.current >= HOLD_DURATION) {
        setBreads((prev) =>
          prev.map((b) => (b.id === found.id ? { ...b, collected: true } : b))
        );
        setCollectedCount((c) => c + 1);
        heldBreadRef.current = null;
        holdStartRef.current = null;

        if (soundEffect && assets[soundEffect]) {
          const audio = new Audio(assets[soundEffect]);
          audio.play();
        }
      }
    } else {
      heldBreadRef.current = null;
      holdStartRef.current = null;
    }
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
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
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks?.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const finger = landmarks[8];
        const fingerPos = {
          x: (1 - finger.x) * canvas.width,
          y: finger.y * canvas.height,
        };

        // ctx.beginPath();
        // ctx.arc(fingerPos.x, fingerPos.y, 5, 0, 2 * Math.PI);
        // ctx.fillStyle = "#FF0000";
        // ctx.fill();

        setFingerPos(fingerPos); // ← 손 위치 저장 (빨간 점 그리기 X)
        updateBreadHold(fingerPos);
      } else {
        // 손 인식이 안 될 때 fingerPos를 null로
        setFingerPos(null);
      }
    });

    const setupCamera = async () => {
      if (videoRef.current && publisher?.stream) {
        const stream = publisher.stream.getMediaStream();
        videoRef.current.srcObject = stream;
    
        try {
          await videoRef.current.play(); // ✅ play 대기
        } catch (err) {
          console.error("🎥 Video play error:", err);
          return;
        }
    
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        });
    
        camera.start();
      }
    };
    setupCamera();
    
  }, [publisher, missionData, assets, breads]);


  return (
    <div
      className="relative"
      style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
    >
      {assets[bgImg] && (
        <img
          src={assets[bgImg]}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute top-0 left-0 z-10"
      />

      {breads.map((bread) =>
        !bread.collected ? (
          <img
            key={bread.id}
            src={assets[breadImg]}
            alt="bread"
            className="absolute w-10 h-10 z-20"
            style={{ left: `${bread.x}px`, top: `${bread.y}px` }}
          />
        ) : null
      )}

      {fingerPos && (
        <div
          className="absolute z-30 text-[40px] pointer-events-none"
          style={{
            left: `${fingerPos.x}px`,
            top: `${fingerPos.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          👆
        </div>
      )}


      <video ref={videoRef} className="hidden" />
    </div>
  );
};

export default HandHoldBreadOverlay;
