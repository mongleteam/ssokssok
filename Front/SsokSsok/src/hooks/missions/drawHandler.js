// ✅ hooks/missions/drawHandler.js
let drawn = false;
export const drawHandler = ({ handLandmarks, onSuccess }) => {
  if (!drawn && handLandmarks?.[8]?.y > 0.8) {
    console.log("🖌 그림 완료!");
    drawn = true;
    onSuccess();
  }
};