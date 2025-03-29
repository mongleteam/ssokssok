// hooks/useHandPose.js
import { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";

export const useHandPose = (videoRef) => {
  const [handData, setHandData] = useState(null);
  const camera = useRef(null);
  const hands = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    hands.current = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.current.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandData(results.multiHandLandmarks[0]);
      } else {
        setHandData(null);
      }
    });

    camera.current = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await hands.current.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.current.start();

    return () => {
      if (camera.current) camera.current.stop();
    };
  }, [videoRef]);

  // 디버깅용 점 렌더링 (DOM 방식)
  useEffect(() => {
    const debugLayer = document.getElementById("hand-debug-layer");
    if (!debugLayer) return;
    debugLayer.innerHTML = "";

    if (!handData) return;

    handData.forEach((point, i) => {
      const dot = document.createElement("div");
      dot.style.position = "absolute";
      dot.style.left = `${(1 - point.x) * 100}%`;
      dot.style.top = `${point.y * 100}%`;
      dot.style.transform = "translate(-50%, -50%)";
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.backgroundColor = "red";
      dot.style.borderRadius = "50%";
      dot.style.zIndex = "9999";
      debugLayer.appendChild(dot);
    });
  }, [handData]);

  const isHandOpen = () => {
    if (!handData) return false;
    const tips = [8, 12, 16, 20];
    const mcp = [5, 9, 13, 17];
    return tips.every((tip, i) => handData[tip].y < handData[mcp[i]].y);
  };

  const isHandClosed = () => {
    if (!handData) return false;
    const tips = [8, 12, 16, 20];
    const mcp = [5, 9, 13, 17];
    return tips.every((tip, i) => handData[tip].y > handData[mcp[i]].y);
  };

  const getHandCenter = () => {
    if (!handData) return null;
    const palmPoints = [0, 5, 9, 13, 17];
    const avgX = palmPoints.reduce((sum, i) => sum + handData[i].x, 0) / palmPoints.length;
    const avgY = palmPoints.reduce((sum, i) => sum + handData[i].y, 0) / palmPoints.length;
    return { x: avgX, y: avgY };
  };

  return { handData, isHandOpen, isHandClosed, getHandCenter };
};
