// 입벌림 인식하는 함수
export const isMouthOpen = (landmarks, threshold = 0.04) => {
  if (!landmarks) return false;
  const upperLip = landmarks[13];
  const lowerLip = landmarks[14];
  // 3D 유클리드 거리 계산 (정규화된 좌표이므로 얼굴 크기에 어느 정도 영향을 받음)
  const distance = Math.sqrt(
    Math.pow(lowerLip.x - upperLip.x, 2) +
      Math.pow(lowerLip.y - upperLip.y, 2) +
      Math.pow(lowerLip.z - upperLip.z, 2)
  );
  return distance > threshold;
};
