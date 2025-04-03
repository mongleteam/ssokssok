// ✅ hooks/missions/getMagicbookHandler.js
let magicbook = false;
export const getMagicbookHandler = ({ handLandmarks, onSuccess }) => {
  if (!magicbook && handLandmarks?.[8]?.x < 0.3) {
    console.log("📖 마법책 획득!");
    magicbook = true;
    onSuccess();
  }
};