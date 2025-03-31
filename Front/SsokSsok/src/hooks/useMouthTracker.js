// 입 동작 인식식
import { useEffect, useRef, useState } from "react";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { isMouthOpen } from "../utils/mouthUtils";

export const useHolisticMouthTracker = (
  videoRef,
  { width = 640, height = 480 } = {}
) => {
  const [mouthOpen, setMouthOpen] = useState(false);
  const prevMouthOpen = useRef(false);
  const holisticRef = useRef(null);

  useEffect(() => {
    // 초기화
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults((results) => {
      if (results.faceLandmarks) {
        const open = isMouthOpen(results.faceLandmarks);
        // 상태 전환만 체크 (open => true, closed => false)
        if (open && !prevMouthOpen.current) {
          prevMouthOpen.current = true;
          setMouthOpen(true);
        } else if (!open && prevMouthOpen.current) {
          prevMouthOpen.current = false;
          setMouthOpen(false);
        }
      }
    });

    holisticRef.current = holistic;

    // 웹캠 스트림 설정
    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width,
        height,
      });
      camera.start();
    }

    // cleanup: 필요 시 카메라 중지, holistic 해제 등
    return () => {
      // 추가 cleanup 로직 (예: holistic.close())
    };
  }, [videoRef, width, height]);

  return { mouthOpen };
};
