export const playShutterSound = () => {
    const audio = new Audio("/assets/sounds/shutterSound.mp3");
    audio.volume = 1;
    audio.play().catch((e) => {
      console.warn("🔇 셔터 소리 재생 실패", e);
    });
  };
  