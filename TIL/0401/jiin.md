## KPT

### Keep

- Team 💡
- 우앙 4월이다 벌써

### Problem

- 추후에 single, multi 페이지 private Routes 만들어서 로그인안하면 아예 못 들어가게 막아야함
- 이미지 위에 오버레이 된 웹캠에서 웹캠이 죽었다 깨나도 캡처가 안됨 
- 기본 useTrackingCore를 또 수정해야 하나 아니면 이미지 + 웹캠 전용 Core를 하나 더 만들어야하나 고민 중... 내일 오전까지 안되면 하나 더 만들어야하나 .. .진짜루 ... 

### Try
- 현재 캡처로 쓰고 있는 html2canvas는 div에 있는 id가 capture-container라면 그 안에 있는 모든 걸 캡처해서 썼는데 이게 CSS 크기가 아니라 실제 픽셀 해상도 기준으로 캡처한다함 ..
- 뒤통수 지대로 맞음 그래서 이미지 + 웹캠 + 오버레이 손을 하니까 파일 크기가 커져서 서버에서 거절하는 사태 발생 -> 기존 이미지를 png로 저장했는데 압축 가능하다는 jpeg로 바꿔서 저장하니까 이제 저장은 되는 거 같음 
- 근데 이거도 내일 오전에 한번 확인은 해야할 거 같은 

---

### Today
- 각 미디어 파이프 훅들 기본 베이스 분리 완료해서 기분 좋았는데 빵줍기 + 보물찾기 등에서 어떻게 해야할지 막막갈비
- 웹캠은 브라우저 보안 정책상 실제 DOM에 있어도 html2canvas로 캡처되지 않는다해서 canvas로 간접처리 했는데 웨 안돼요 ? 
- captureComposieImage 유틸에서 로직을 추가하라는데 내일 할래 ..  
```
export const captureCompositeImage = async (containerId) => {
  const container = document.getElementById(containerId);
  const webcamVideo = container.querySelector("video");

  // 💡 video를 canvas로 복사
  const webcamCanvas = document.createElement("canvas");
  webcamCanvas.width = webcamVideo.videoWidth;
  webcamCanvas.height = webcamVideo.videoHeight;
  const ctx = webcamCanvas.getContext("2d");
  ctx.drawImage(webcamVideo, 0, 0, webcamCanvas.width, webcamCanvas.height);

  // 💡 기존 container 안에 잠깐 추가 (html2canvas가 인식 가능하게)
  webcamCanvas.style.position = "absolute";
  webcamCanvas.style.top = webcamVideo.offsetTop + "px";
  webcamCanvas.style.left = webcamVideo.offsetLeft + "px";
  webcamCanvas.style.width = webcamVideo.offsetWidth + "px";
  webcamCanvas.style.height = webcamVideo.offsetHeight + "px";
  webcamCanvas.style.zIndex = webcamVideo.style.zIndex;
  container.appendChild(webcamCanvas);

  // ✅ 캡처 진행
  const canvas = await html2canvas(container);

  // ⛔️ 사용 끝났으니 캔버스 제거
  container.removeChild(webcamCanvas);

  const url = canvas.toDataURL("image/png");
  return { url };
};

```















