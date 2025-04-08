import { useEffect, useRef, useState } from "react";

export const useDrawStarMission = (width, height, backgroundImage, onComplete) => {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const [starPoints, setStarPoints] = useState([]);
  const [visited, setVisited] = useState([]);
  const [drawPath, setDrawPath] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentFingerPos, setCurrentFingerPos] = useState(null);
  const [started, setStarted] = useState(false); // 1번 점에 도달했는지 여부부
  const completedRef = useRef(false); // 미션 성공 여부

  // 별 꼭짓점 생성 함수수
  const makeStarPoints = (cx, cy, outerR, innerR, numPoints = 5) => {
    const points = [];
    const step = Math.PI / numPoints;
    for (let i = 0; i < 2 * numPoints; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    points.push(points[0]); // 마지막 점은 닫기용
    return points;
  };

  // 별점 세팅팅
  useEffect(() => {
    const points = makeStarPoints(width / 2, height / 2, 120, 50);
    setStarPoints(points);
    setVisited(new Array(points.length).fill(false));
  }, [width, height]);


  // 배경 이미지 로드드
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


  // 사용자 손가락 위치 업데이트
  const updateDrawing = (tip, isDrawing) => {
    setCurrentFingerPos(tip);

    // ✋ 미션 성공 후에는 더 이상 그리지 않음
    if (completedRef.current) return;

    // ✋ 아직 1번 점에 도달하지 않았다면 무시
    if (!started && isNear(tip, starPoints[0])) {
      setStarted(true); // 시작점 도달 시 시작 표시
    }

    if (!started || !isDrawing) return;

    setDrawPath((prev) => [...prev, tip]);

    setVisited((prev) => {
      const updated = [...prev];

      starPoints.forEach((point, i) => {
        if (!updated[i] && isNear(tip, point)) {
          updated[i] = true;
        }
      });

      // 미션 성공 조건:
      // 1. 1번 점에서 시작했고
      // 2. 2~10번 꼭짓점 다 들렀고
      // 3. 현재 손가락이 1번 점 근처로 다시 왔을 때
      const totalPoints = starPoints.length - 1;
      const allOthersVisited = updated.slice(1, totalPoints).every(Boolean);
      const backToStart = isNear(tip, starPoints[0]);

      // 🎯 성공 조건: 1번에서 시작 + 2~10번 모두 방문 + 다시 1번으로
      if (started && allOthersVisited && backToStart && !completedRef.current) {
        completedRef.current = true;
        setProgress(100);
        onComplete?.();
      }

      return updated;
    });
  };

  // 진행률 계산
  useEffect(() => {
    const totalPoints = starPoints.length - 1;
    const allOthersVisited = visited.slice(1, totalPoints).every(Boolean);
    const backToStart = currentFingerPos && isNear(currentFingerPos, starPoints[0]);

    if (started && allOthersVisited && backToStart && !completedRef.current) {
      setProgress(100); // 성공 시만 100%
    } else if (!completedRef.current && started) {
      const count = visited.slice(1, totalPoints).filter(Boolean).length;
      const progressValue = Math.min(Math.round((count / (totalPoints - 1)) * 100), 99);
      setProgress(progressValue);
    }
  }, [visited, currentFingerPos]);

  // 🖌 캔버스 그리기
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !bgRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(width, 0); // 좌우 반전
    ctx.scale(-1, 1);

    // 📷 배경
    ctx.drawImage(bgRef.current, 0, 0, width, height);

    // ✅ 항상 회색 별 선 먼저 그림 (성공 여부와 관계 없음)
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

    // ✨ 정식 가이드 라인 별 (성공 시만 표시)
    if (completedRef.current && starPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "gold";
      ctx.lineWidth = 4;
      ctx.moveTo(starPoints[0].x, starPoints[0].y);
      for (let i = 1; i < starPoints.length; i++) {
        ctx.lineTo(starPoints[i].x, starPoints[i].y);
      }
      ctx.stroke();
    }

    // ✍️ 사용자 그린 선 (미션 중일 때만)
    if (!completedRef.current && drawPath.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 3;
      ctx.moveTo(drawPath[0].x, drawPath[0].y);
      for (let i = 1; i < drawPath.length; i++) {
        ctx.lineTo(drawPath[i].x, drawPath[i].y);
      }
      ctx.stroke();
    }

    // 🟢 별 꼭짓점
    starPoints.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = visited[i] ? "#00ff00" : "gray";
      ctx.fill();
    });

    // 🔵 손가락 위치
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
    starPoints,
  };
};