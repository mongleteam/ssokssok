import { useEffect, useRef, useState } from "react";

export const useDrawStarMission = (width, height, backgroundImage, onComplete) => {
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
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    points.push(points[0]);
    return points;
  };

  useEffect(() => {
    const points = makeStarPoints(width / 2, height / 2, 120, 50);
    setStarPoints(points);
    setVisited(new Array(points.length).fill(false));
  }, [width, height]);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      bgRef.current = img;
      drawCanvas();
    };
  }, [backgroundImage]);

  const isNear = (p1, p2, threshold = 30) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy <= threshold * threshold;
  };

  const updateDrawing = (tip, isDrawing) => {
    setCurrentFingerPos(tip);
    if (!isDrawing) return;

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
  };

  useEffect(() => {
    const newProgress =
      visited.length > 0
        ? Math.round((visited.filter((v) => v).length / visited.length) * 100)
        : 0;
    setProgress(newProgress);
  }, [visited]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !bgRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(bgRef.current, 0, 0, width, height);

    if (starPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(180, 180, 180, 0.5)";
      ctx.lineWidth = 2;
      ctx.moveTo(starPoints[0].x, starPoints[0].y);
      for (let i = 1; i < starPoints.length; i++) {
        ctx.lineTo(starPoints[i].x, starPoints[i].y);
      }
      ctx.stroke();
    }

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

  return {
    canvasRef,
    drawCanvas,
    updateDrawing,
    progress,
  };
};
