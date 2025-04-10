import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands/hands";
import { Camera } from "@mediapipe/camera_utils/camera_utils";

const MagicCircleMission = ({ width = 480, height = 360, backgroundImage, onComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);

  const [starPoints, setStarPoints] = useState([]);
  const [visited, setVisited] = useState([]);
  const [drawPath, setDrawPath] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isBackToStart, setIsBackToStart] = useState(false);
  const [currentFingerPos, setCurrentFingerPos] = useState(null);

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
    const points = makeStarPoints(240, 180, 120, 50);
    setStarPoints(points);
    setVisited(new Array(points.length).fill(false));
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      bgRef.current = img;
      drawCanvas();
    };
  }, [backgroundImage]);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width,
      height,
    });
    camera.start();

    return () => camera.stop();
  }, [starPoints]);

  const isNear = (p1, p2, threshold = 30) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy <= threshold * threshold;
  };

  // frame 마다 호출되는 함수
  // 각 frame에서 뭐할지 
  const onResults = (results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

    const landmarks = results.multiHandLandmarks[0];
    const fingerTip = landmarks[8];
    const fingerPip = landmarks[6];

    const x = fingerTip.x * width;
    const y = fingerTip.y * height;
    const tip = { x, y };

    setCurrentFingerPos(tip);

    const isDrawing = fingerTip.y < fingerPip.y - 0.02;

    // 만약 그리고 있다면
    if (isDrawing) {
      
      // tip 좌표를 그림에 추가한다.
      // 이 때 상대방에게 event를 보내야함
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
          onComplete?.();
        }

        return updated;
      });
    }
  };

  useEffect(() => {
    const newProgress =
      visited.length > 0
        ? Math.round((visited.filter((v) => v).length / visited.length) * 100)
        : 0;
    setProgress(newProgress);
  }, [visited]);

  const drawCanvas = () => {
    // console.log("🖌️ drawCanvas 호출됨");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d"); // canvas
    if (!ctx || !bgRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(bgRef.current, 0, 0, width, height);

      // 2. ⭐ 가이드라인 (회색)
      if (starPoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(180, 180, 180, 0.5)"; // 연한 회색
        ctx.lineWidth = 2;
        ctx.moveTo(starPoints[0].x, starPoints[0].y);
        for (let i = 1; i < starPoints.length; i++) {
          ctx.lineTo(starPoints[i].x, starPoints[i].y);
        }
        ctx.stroke();
      }

      // 3. ✍️ 유저가 그린 선 (노란색)
      if (drawPath.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "yellow"; // 유저 선은 노란색
        ctx.lineWidth = 3;
        ctx.moveTo(drawPath[0].x, drawPath[0].y);
        for (let i = 1; i < drawPath.length; i++) {
          ctx.lineTo(drawPath[i].x, drawPath[i].y);
        }
        ctx.stroke();
      }

    starPoints.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = visited[i] ? "#00ff00" : "gray";
      ctx.fill();
    });

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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="border rounded-lg w-[480px] h-[360px] scale-x-[-1]"
        />
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border rounded-lg"
          />
      </div>
      <div className="w-full flex flex-col items-center gap-2 mt-4">
        <div className="text-lg font-bold text-gray-700">
          진행률: {progress}%
        </div>
        <div className="w-80 h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MagicCircleMission;
