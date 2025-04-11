// 두 점 사이의 유클리드 거리 계산
function distance(point1, point2) {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 손가락이 '펴졌다(extended)'고 볼 수 있는지 판단.
 *    - tip과 wrist 사이 거리 > threshold * (pip과 wrist 사이 거리)
 */
function isFingerExtended(landmarks, pipIdx, tipIdx, threshold = 1.3) {
  const wrist = landmarks[0];
  const pip = landmarks[pipIdx];
  const tip = landmarks[tipIdx];
  return distance(tip, wrist) > threshold * distance(pip, wrist);
}

/**
 * 손가락이 '접혔다(folded)'고 볼 수 있는지 판단.
 *    - tip과 wrist 사이 거리 < threshold * (pip과 wrist 사이 거리)
 *    - 혹은 isFingerExtended와 반대 조건으로 판단 가능
 */
function isFingerFolded(landmarks, pipIdx, tipIdx, threshold = 1.0) {
  const wrist = landmarks[0];
  const pip = landmarks[pipIdx];
  const tip = landmarks[tipIdx];
  return distance(tip, wrist) < threshold * distance(pip, wrist);
}

export function getHandGesture(landmarks) {
  if (!landmarks) return null;

  const thumbExtended = isFingerExtended(landmarks, 2, 4, 1.2);
  const indexExtended = isFingerExtended(landmarks, 6, 8, 1.2);
  const indexFolded = isFingerFolded(landmarks, 6, 8, 1.05);

  const middleExtended = isFingerExtended(landmarks, 10, 12, 1.2);
  const middleFolded = isFingerFolded(landmarks, 10, 12, 1.05);

  const ringExtended = isFingerExtended(landmarks, 14, 16, 1.2);
  const ringFolded = isFingerFolded(landmarks, 14, 16, 1.1);

  const pinkyExtended = isFingerExtended(landmarks, 18, 20, 1.2);
  const pinkyFolded = isFingerFolded(landmarks, 18, 20, 1.1);

  // 🔍 두 가지 조건 중 하나만 만족해도 scissors
  const scissorsByIndexMiddle =
    indexExtended &&
    middleExtended &&
    (ringFolded || !ringExtended) &&
    (pinkyFolded || !pinkyExtended);

  const scissorsByThumbIndex =
    thumbExtended &&
    indexExtended &&
    (middleFolded || !middleExtended) &&
    (ringFolded || !ringExtended) &&
    (pinkyFolded || !pinkyExtended);

  if (scissorsByIndexMiddle || scissorsByThumbIndex) {
    return "scissors";
  }

  // 🪨 ROCK
  if (indexFolded && middleFolded && ringFolded && pinkyFolded) {
    return "rock";
  }

  // ✋ PAPER
  const extendedCount = [
    indexExtended,
    middleExtended,
    ringExtended,
    pinkyExtended,
  ].filter(Boolean).length;
  if (extendedCount >= 3) return "paper";

  return null;
}
