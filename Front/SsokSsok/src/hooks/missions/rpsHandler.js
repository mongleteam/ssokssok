import { getHandGesture } from "../../utils/gestureDetector";
import { getRandomWitchHand } from "../../utils/getRandomWitchHand";
import { judgeRPS } from "../../utils/judgeRPS";
judgeRPS
let called = false;

export const rpsHandler = ({ handLandmarks, onSuccess }) => {
  if (!handLandmarks || called) return;

  const gesture = getHandGesture(handLandmarks);
  if (["rock", "paper", "scissors"].includes(gesture)) {
    const witch = getRandomWitchHand();
    const result = judgeRPS(gesture, witch);

    if (result === "win") {
      console.log("🎉 승리!");
      called = true;
      onSuccess();
    }
  }
};
