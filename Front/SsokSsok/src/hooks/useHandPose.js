// hooks/useHandPose.js
import { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";
import * as handPose from "@mediapipe/hands";

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

  // ✋ 보조 함수: 손이 펴져 있는지, 주먹 쥐었는지 판단
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

  // ✋ 손바닥 좌표 중심 구하기
  const getHandCenter = () => {
    if (!handData) return null;
    const palmPoints = [0, 5, 9, 13, 17];
    const avgX = palmPoints.reduce((sum, i) => sum + handData[i].x, 0) / palmPoints.length;
    const avgY = palmPoints.reduce((sum, i) => sum + handData[i].y, 0) / palmPoints.length;
    return { x: avgX, y: avgY };
  };

  return { handData, isHandOpen, isHandClosed, getHandCenter };
};
