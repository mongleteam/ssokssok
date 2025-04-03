
// ✅ hooks/missions/holdBreadHandler.js
let held = false;
export const holdBreadHandler = ({ handLandmarks, onSuccess, utils }) => {
  if (!held && utils.checkThumbPose(handLandmarks)) {
    console.log("🍞 빵 잘 잡았어요!");
    held = true;
    onSuccess();
  }
};