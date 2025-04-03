// ✅ hooks/missions/treasureHuntHandler.js
let found = false;
export const treasureHuntHandler = ({ handLandmarks, onSuccess }) => {
  if (!found && handLandmarks?.[8]?.x >= 0.45 && handLandmarks?.[8]?.x <= 0.55) {
    console.log("💰 보물 발견!");
    found = true;
    onSuccess();
  }
};