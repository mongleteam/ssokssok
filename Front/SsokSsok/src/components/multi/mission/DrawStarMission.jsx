import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands/hands";
import { Camera } from "@mediapipe/camera_utils/camera_utils";
import { sendMessage, onSocketEvent, offSocketEvent } from "../../../services/socket";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const DrawStarMission = ({
  missionData,
  assets,
  onSuccess,
  publisher,
  roomId,
  userName,
  from,
  setStatusContent,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);

  const isGretel = userName === "그레텔";

  const [starPoints, setStarPoints] = useState([]);
  const [visited, setVisited] = useState([]);
  const [drawPath, setDrawPath] = useState([]);
  const [currentFingerPos, setCurrentFingerPos] = useState(null);
  const [isBackToStart, setIsBackToStart] = useState(false);

  const makeStarPoints = (cx, cy, outerR, innerR, numPoints = 5) => {
    const points = [];
    const step = Math.PI / numPoints;
    for (let i = 0; i < 2 * numPoints; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      points.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    points.push(points[0]);
    return points;
  };

  // 🔁 상대방 좌표 받기
  useEffect(() => {
    const handleDraw = ({ senderName: sender, x, y }) => {
      if (sender === userName) return; // 내 좌표 무시
      const tip = { x, y };
      setDrawPath((prev) => [...prev, tip]);

        // ✅ 헨젤도 visited 업데이트 추가
      setVisited((prev) => {
        const updated = [...prev];
        starPoints.forEach((point, i) => {
          if (!updated[i] && isNear(tip, point)) {
            updated[i] = true;
          }
        });
        return updated;
      });
    };

    onSocketEvent("draw", handleDraw);
    return () => {
      offSocketEvent("draw", handleDraw);
    };
  }, [userName, starPoints]);


  useEffect(() => {
    const points = makeStarPoints(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 120, 50);
    setStarPoints(points);
    setVisited(new Array(points.length).fill(false));
  }, []);

  useEffect(() => {
    const img = new Image();
    const bgImg = missionData?.instructionImages?.[1];
    if (!bgImg || !assets[bgImg]) return;
    img.src = assets[bgImg];
    img.onload = () => {
      bgRef.current = img;
      drawCanvas();
    };
  }, [assets, missionData]);

  const isNear = (p1, p2, threshold = 30) => {
    if (!p1 || !p2) return false;
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy <= threshold * threshold;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !bgRef.current) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 좌우 반전
    ctx.save();
    ctx.translate(CANVAS_WIDTH, 0);
    ctx.scale(-1, 1);
    ctx.restore();

    // 배경
    ctx.drawImage(bgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 유저 그린 선
    if (drawPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 3;
      ctx.moveTo(drawPath[0].x, drawPath[0].y);
      for (let i = 1; i < drawPath.length; i++) {
        ctx.lineTo(drawPath[i].x, drawPath[i].y);
      }
      ctx.stroke();
    }

    // 별 점들
    starPoints.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = visited[i] ? "#00ff00" : "gray";
      ctx.fill();
    });

    // 손가락 점
    if (currentFingerPos) {
      ctx.beginPath();
      ctx.arc(currentFingerPos.x, currentFingerPos.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#00bfff";
      ctx.fill();
    }

    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
  }, [visited, drawPath, starPoints, currentFingerPos]);

  useEffect(() => {
    if (!isGretel) return; // 🎯 헨젤은 손 인식 + 카메라 스킵

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      if (!results.multiHandLandmarks?.length) return;
      const landmarks = results.multiHandLandmarks[0];
      const fingerTip = landmarks[8];
      const fingerPip = landmarks[6];

      // 반전된 캔버스 좌표
      const tip = {
        x: CANVAS_WIDTH - fingerTip.x * CANVAS_WIDTH,
        y: fingerTip.y * CANVAS_HEIGHT,
      };
      const pipY = fingerPip.y * CANVAS_HEIGHT;

      setCurrentFingerPos(tip);

      const isDrawing = tip.y < pipY - 10;
      if (isDrawing) {
        setDrawPath((prev) => [...prev, tip]);

        sendMessage("draw", {
          roomId,
          senderName: userName,
          x: tip.x,
          y: tip.y,
        });

        setVisited((prev) => {
          const updated = [...prev];
          starPoints.forEach((point, i) => {
            if (!updated[i] && isNear(tip, point)) {
              updated[i] = true;
            }
          });

          const allVisited = updated.every((v) => v);
          const backToStart = isNear(tip, starPoints[0]);
          if (allVisited && backToStart && !isBackToStart) {
            setIsBackToStart(true);
            onSuccess?.();
            sendMessage("isSuccess", {
              senderName: userName,
              roomId,
              isSuccess: "성공",
            });
          }

          return updated;
        });
      }
    });

    const setupCamera = async () => {
      if (videoRef.current && publisher?.stream) {
        const stream = publisher.stream.getMediaStream();
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
          const camera = new Camera(videoRef.current, {
            onFrame: async () => await hands.send({ image: videoRef.current }),
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          });
          camera.start();
        } catch (err) {
          console.error("❌ video play error", err);
        }
      }
    };

    setupCamera();
  }, [publisher, starPoints]);

  const progress =
    visited.length > 0
      ? Math.round((visited.filter((v) => v).length / visited.length) * 100)
      : 0;

  useEffect(() => {
    const message =
    progress === 100
      ? "✨ 마법진 그리기 성공! ✨"
      : `마법진 그리기 진행률: ${progress}%`;

    setStatusContent?.(
      <div className="text-3xl font-cafe24 text-green-700 text-center animate-pulse">
      {message}
      </div>
    );
    return () => setStatusContent?.(null);
  }, [progress]);

  return (
    <div className="relative w-full max-w-[640px] mx-auto aspect-video">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="absolute top-0 left-0 w-full h-full object-cover scale-x-[-1]" // 비디오만 반전
      />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
    </div>
  );
};

export default DrawStarMission;
