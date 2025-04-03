// import html2canvas from "html2canvas";

// export const captureCompositeImage = async (containerId) => {
//   const container = document.getElementById(containerId);
//   if (!container) throw new Error("캡처할 요소를 찾을 수 없습니다.");

//   const canvas = await html2canvas(container, {
//     scale: 1, // 기본 해상도 (리사이징 방지)
//     useCORS: true, // 외부 이미지가 있다면 이 옵션도 유용함
//   });

//   return new Promise((resolve) => {
//     canvas.toBlob(
//       (blob) => {
//         const url = URL.createObjectURL(blob);
//         resolve({ url, blob });
//       },
//       "image/jpeg", // JPEG 포맷으로 압축
//       0.8 // 압축률 (0~1)
//     );
//   });
// };


// import html2canvas from "html2canvas";

// export const captureCompositeImage = async (containerId) => {
//   const container = document.getElementById(containerId);
//   const video = container.querySelector("video");
//   if (!container || !video) throw new Error("캡처 대상이 올바르지 않습니다.");

//   // 1. html2canvas로 전체 화면 (비디오 제외) 캡처
//   const baseCanvas = await html2canvas(container, {
//     scale: 1,
//     useCORS: true,
//     ignoreElements: (el) => el.tagName === "VIDEO", // video는 따로 그릴 거니까 제외
//   });

//   const finalCanvas = document.createElement("canvas");
//   finalCanvas.width = baseCanvas.width;
//   finalCanvas.height = baseCanvas.height;
//   const ctx = finalCanvas.getContext("2d");

//   // 2. 먼저 html2canvas에서 만든 배경 그리기
//   ctx.drawImage(baseCanvas, 0, 0);

//   // 3. 비디오의 위치 계산 (relative/absolute 기준)
//   const videoRect = video.getBoundingClientRect();
//   const containerRect = container.getBoundingClientRect();

//   const x = videoRect.left - containerRect.left;
//   const y = videoRect.top - containerRect.top;
//   const width = videoRect.width;
//   const height = videoRect.height;

//   // 4. 좌우반전된 비디오 그리기 (원한다면)
//   ctx.save();
//   ctx.translate(x + width, y); // 좌우반전 기준점 이동
//   ctx.scale(-1, 1); // 좌우반전
//   ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, width, height);
//   ctx.restore();

//   // 5. 최종 캡처 이미지 반환
//   return new Promise((resolve) => {
//     finalCanvas.toBlob(
//       (blob) => {
//         const url = URL.createObjectURL(blob);
//         resolve({ url, blob });
//       },
//       "image/jpeg",
//       0.9
//     );
//   });
// };

import html2canvas from "html2canvas";

export const captureCompositeImage = async (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("❌ 캡처 대상이 없습니다.");

  const video = container.querySelector("video");
  if (!video) throw new Error("❌ video 요소를 찾을 수 없습니다.");

  // ✅ html2canvas로 container 캡처하되 video만 제외
  const baseCanvas = await html2canvas(container, {
    scale: 1,
    useCORS: true,
    ignoreElements: (el) => el.tagName === "VIDEO", // 조약돌 등은 포함됨!
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
