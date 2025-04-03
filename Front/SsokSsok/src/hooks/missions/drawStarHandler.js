// ✅ hooks/missions/drawStarHandler.js
import { useDrawStarMission } from "../useDrawStarMission";
// handler는 훅을 쓰지 않고 그냥 updateDrawing만 받음
export const drawStarHandler = ({ handLandmarks, utils, updateDrawing }) => {
    if (!handLandmarks) return;
    const tip = utils.getFingerPosition(handLandmarks);
    if (tip) updateDrawing(tip, true);
  };