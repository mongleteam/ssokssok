// 배경이미지 위 영상 웹캠까지 캡쳐 가능 기능 - 멀티는 이거 사용하면 됨.
import html2canvas from "html2canvas";

export const captureCompositeImage= async (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("❌ 캡처 대상이 없습니다.");

  const video = container.querySelector("video");
  if (!video) throw new Error("❌ video 요소를 찾을 수 없습니다.");

  // ✅ html2canvas로 container 캡처하되 video만 제외
  const baseCanvas = await html2canvas(container, {
    scale: 1,
    useCORS: true,
    // ignoreElements: (el) => el.tagName === "VIDEO", // 조약돌 등은 포함됨!
  });

  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = baseCanvas.width;
  finalCanvas.height = baseCanvas.height;
  const ctx = finalCanvas.getContext("2d");

  // 배경 + 조약돌 등 오버레이 먼저 그림
  ctx.drawImage(baseCanvas, 0, 0);

  // 비디오 위치 계산해서 직접 그리기
  const videoRect = video.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const x = videoRect.left - containerRect.left;
  const y = videoRect.top - containerRect.top;
  const width = videoRect.width;
  const height = videoRect.height;

  ctx.save();
  ctx.translate(x + width, y);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, width, height);
  ctx.restore();

  // 최종 blob 반환
  return new Promise((resolve) => {
    finalCanvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        resolve({ url, blob });
      },
      "image/jpeg",
      0.9
    );
  });
};