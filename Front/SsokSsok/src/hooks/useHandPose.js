// hooks/useHandPose.js
import { useMemo } from "react";

export const useHandPose = (handLandmarks) => {
  const isHandOpen = useMemo(() => {
    if (!handLandmarks) return false;
    const tips = [8, 12, 16, 20];
    const mcp = [5, 9, 13, 17];
    return tips.every((tip, i) => handLandmarks[tip].y < handLandmarks[mcp[i]].y);
  }, [handLandmarks]);

  const isHandClosed = useMemo(() => {
    if (!handLandmarks) return false;
    const tips = [8, 12, 16, 20];
    const mcp = [5, 9, 13, 17];
    return tips.every((tip, i) => handLandmarks[tip].y > handLandmarks[mcp[i]].y);
  }, [handLandmarks]);

  const getHandCenter = useMemo(() => {
    if (!handLandmarks) return null;
    const palmPoints = [0, 5, 9, 13, 17];
    const avgX = palmPoints.reduce((sum, i) => sum + handLandmarks[i].x, 0) / palmPoints.length;
    const avgY = palmPoints.reduce((sum, i) => sum + handLandmarks[i].y, 0) / palmPoints.length;
    return { x: avgX, y: avgY };
  }, [handLandmarks]);

  return { isHandOpen, isHandClosed, getHandCenter };
};
