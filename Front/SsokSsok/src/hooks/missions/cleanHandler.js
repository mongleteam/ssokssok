// ✅ hooks/missions/cleanHandler.js
let success = false;
export const cleanHandler = ({ handLandmarks, onSuccess, utils }) => {
  if (utils.isHandShaking(handLandmarks) && !success) {
    console.log("🧹 손 흔들기 성공");
    success = true;
    onSuccess();
  }
};
