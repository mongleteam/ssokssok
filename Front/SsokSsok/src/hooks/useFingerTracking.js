import { useMemo } from "react";

export const useFingerPosition = (handLandmarks) => {
  return useMemo(() => {
    if (!handLandmarks || handLandmarks.length < 9) return null;
    const indexTip = handLandmarks[8];
    return { x: indexTip.x, y: indexTip.y };
  }, [handLandmarks]);
};

export const useFingerTracking = useFingerPosition;
