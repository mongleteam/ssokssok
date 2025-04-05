import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands/hands";
import { Camera } from "@mediapipe/camera_utils/camera_utils";

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
    ctx.save();
    ctx.translate(CANVAS_WIDTH, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(bgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (starPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(180,180,180,0.5)";
      ctx.lineWidth = 2;
      ctx.moveTo(CANVAS_WIDTH - drawPath[0].x, drawPath[0].y);
      for (let i = 1; i < drawPath.length; i++) {
        ctx.lineTo(CANVAS_WIDTH - drawPath[i].x, drawPath[i].y);
      }
      ctx.stroke();
    }

    // ✍️ 유저가 그린 선
    if (drawPath.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.moveTo(CANVAS_WIDTH - drawPath[0].x, drawPath[0].y);
        for (let i = 1; i < drawPath.length; i++) {
        ctx.lineTo(CANVAS_WIDTH - drawPath[i].x, drawPath[i].y);
        }
        ctx.stroke();
    }

    starPoints.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH - p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = visited[i] ? "#00ff00" : "gray";
      ctx.fill();
    });

    if (currentFingerPos) {
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH - currentFingerPos.x, currentFingerPos.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#00bfff";
      ctx.fill();
    }

    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
  }, [visited, drawPath, starPoints, currentFingerPos]);

  useEffect(() => {
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
      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

      const landmarks = results.multiHandLandmarks[0];
      const fingerTip = landmarks[8];
      const fingerPip = landmarks[6];

      const tip = {
        x: fingerTip.x * CANVAS_WIDTH, // 원래는 이렇게 되어야 정상 인식
        y: fingerTip.y * CANVAS_HEIGHT,
      };
      const pipY = fingerPip.y * CANVAS_HEIGHT;

      setCurrentFingerPos(tip);

      const isDrawing = tip.y < pipY - 10;
      if (isDrawing) {
        setDrawPath((prev) => [...prev, tip]);
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

  const progress = visited.length > 0 ? Math.round((visited.filter((v) => v).length / visited.length) * 100) : 0;

  useEffect(() => {
    setStatusContent?.(
      <div className="text-3xl font-cafe24 text-green-700 text-center animate-pulse">
        별 그리기 진행률: {progress}%
      </div>
    );
    return () => setStatusContent?.(null);
  }, [progress]);

  return (
    <>
      <video ref={videoRef} autoPlay muted  style={{ transform: "scaleX(-1)" }} className="hidden" />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
    </>
  );
};

export default DrawStarMission;
