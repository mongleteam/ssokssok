import { create } from "zustand";

const useBgmStore = create((set, get) => ({
  audio: null,
  isPlaying: false,
  volume: 0.3,

  initBgm: () => {
    const { audio, isPlaying, volume } = get();
  
    if (isPlaying || (audio && !audio.paused)) {
      // console.log("🎧 이미 재생 중이라 무시함");
      return;
    }
  
    let bgm = audio;
  
    if (!bgm) {
      bgm = new Audio("/assets/sounds/main_bgm.mp3");
      bgm.loop = true;
      bgm.volume = volume;
    }
  
    bgm.play()
      .then(() => {
        // console.log("🎵 initBgm 재생됨");
        set({ audio: bgm, isPlaying: true }); // ✅ play 성공 후에 저장!
      })
      .catch((err) => {
        // console.error("BGM play 실패", err);
      });
  },
  

  stopBgm: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    set({ isPlaying: false });
  },

  setVolume: (vol) => {
    const { audio } = get();
    // console.log("🎧 현재 오디오 객체:", audio);
    if (audio) {
      audio.volume = vol;
      // console.log("🔊 볼륨 반영 완료:", audio.volume);
    } else {
      // console.warn("❌ 오디오가 아직 null이야!");
    }
    set({ volume: vol });
  }



}));

export default useBgmStore;
