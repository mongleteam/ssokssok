// ✅ hooks/missions/eatCookieHandler.js
let eatCount = 0;
export const eatCookieHandler = ({ faceLandmarks, onSuccess, utils }) => {
  if (utils.checkMouthOpen(faceLandmarks)) {
    eatCount++;
    console.log("🍪 쿠키 먹는 중", eatCount);
    if (eatCount >= 3) onSuccess();
  }
};