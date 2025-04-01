import html2canvas from "html2canvas";

export const captureCompositeImage = async (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("캡처할 요소를 찾을 수 없습니다.");

  const canvas = await html2canvas(container, {
    scale: 1, // 기본 해상도 (리사이징 방지)
    useCORS: true, // 외부 이미지가 있다면 이 옵션도 유용함
  });

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        resolve({ url, blob });
      },
      "image/jpeg", // JPEG 포맷으로 압축
      0.8 // 압축률 (0~1)
    );
  });
};
