import html2canvas from "html2canvas";

export const captureCompositeImage = async (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("캡처할 요소를 찾을 수 없습니다.");

  const video = container.querySelector("video");
  let videoCanvas = null;

  if (video && video.videoWidth > 0) {
    // console.log("✅ video 태그 찾음:", video);
    // console.log("📏 video 크기:", video.videoWidth, video.videoHeight);

    videoCanvas = document.createElement("canvas");
    videoCanvas.width = video.videoWidth;
    videoCanvas.height = video.videoHeight;

    const ctx = videoCanvas.getContext("2d");
    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);

    // 스타일 명시
    videoCanvas.className = video.className;
    videoCanvas.style.cssText = video.style.cssText;
    videoCanvas.style.position = "absolute";
    videoCanvas.style.zIndex = "9999";
    videoCanvas.style.opacity = "1";

    video.style.display = "none";
    video.parentNode.appendChild(videoCanvas);

    // console.log("✅ video → canvas 복제 완료", videoCanvas);
    // console.log("📍 위치 정보:", videoCanvas.getBoundingClientRect());
  } else {
    console.warn("⚠️ video 태그가 없거나 아직 로드되지 않음");
  }

  const canvas = await html2canvas(container, {
    scale: 1,
    useCORS: true,
  });

  if (video) {
    video.style.display = "block";
    if (videoCanvas) videoCanvas.remove();
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      resolve({ url, blob });
    }, "image/jpeg", 0.8);
  });
};