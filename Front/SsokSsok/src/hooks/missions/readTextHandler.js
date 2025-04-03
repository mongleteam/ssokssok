// ✅ hooks/missions/readTextHandler.js
export const readTextHandler = ({ micVolume, onSuccess }) => {
    if (micVolume > 0.03) {
      console.log("🗣 음성 감지됨!");
      onSuccess();
    }
  };