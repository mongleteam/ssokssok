import html2canvas from "html2canvas";

export const captureCompositeImage = async (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("캡처할 요소를 찾을 수 없습니다.");
  const canvas = await html2canvas(container);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve({ url, blob });
    }, "image/png");
  });
};
