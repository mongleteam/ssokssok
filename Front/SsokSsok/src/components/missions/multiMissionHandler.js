// src/missions/multiMissionHandlers.js

import { isMouthOpen } from "../../utils/mouthUtils";
import { getHandGesture } from "../../utils/gestureDetector";
import { judgeRPS } from "../../utils/judgeRPS";


// 1. 조용히 하기
export const silentHandler = ({ micVolume, onSuccess }) => {
  if (micVolume < 0.02) {
    onSuccess();
  }
};

// 2. 입 벌렸다 닫기
let wasOpen = false;
export const eatCookieHandler = ({ faceLandmarks, onSuccess }) => {
  const open = isMouthOpen(faceLandmarks);
  if (open) {
    wasOpen = true;
  } else if (wasOpen) {
    wasOpen = false;
    onSuccess();
  }
};

// 3. 가위바위보
export const rpsHandler = ({ handLandmarks, onSuccess }) => {
  const player = getHandGesture(handLandmarks);
  const witch = "scissors";
  const result = judgeRPS(player, witch);
  if (result === "win") {
    onSuccess();
  }
};

// 4. 손 흔들기 (청소 미션)
let prevX = null;
let movedLeft = false;
let movedRight = false;
let count = 0;
export const cleanHandler = ({ handLandmarks, onSuccess }) => {
  if (!handLandmarks) return;
  const x = handLandmarks[0].x;
  if (prevX === null) prevX = x;
  const dx = x - prevX;
  const threshold = 0.1;

  if (dx > threshold) movedRight = true;
  if (dx < -threshold) movedLeft = true;

  if (movedLeft && movedRight) {
    count++;
    movedLeft = false;
    movedRight = false;
    console.log("청소 횟수:", count);
  }

  if (count >= 3) onSuccess();
  prevX = x;
};
