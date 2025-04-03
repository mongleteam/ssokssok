// ✅ hooks/missions/getKeyHandler.js
let keyGot = false;
export const getKeyHandler = ({ handLandmarks, onSuccess }) => {
  if (!keyGot && handLandmarks?.[8]?.x > 0.5) {
    console.log("🔑 열쇠 얻음!");
    keyGot = true;
    onSuccess();
  }
};