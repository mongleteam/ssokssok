// hooks/useFingerTracking.js
import { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import { Hands } from "@mediapipe/hands";

export const useFingerTracking = (videoRef) => {
  const [fingerPos, setFingerPos] = useState(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    handsRef.current = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handsRef.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    handsRef.current.onResults((results) => {
      if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
      ) {
        const landmarks = results.multiHandLandmarks[0];
        const indexTip = landmarks[8]; // 검지 끝 좌표
        setFingerPos({ x: indexTip.x, y: indexTip.y });
      } else {
        setFingerPos(null);
      }
    });

    cameraRef.current = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await handsRef.current.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();

    return () => {
      cameraRef.current?.stop();
    };
  }, [videoRef]);

  return { fingerPos };
};
