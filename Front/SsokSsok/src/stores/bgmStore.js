// src/stores/bgmStore.js
import { create } from "zustand";

const useBgmStore = create((set) => ({
  audio: null,
  isPlaying: false,
  volume: 0.3,

  initBgm: () => {
    const bgm = new Audio("/assets/sounds/main_bgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.3;
    bgm.play().then(() => {
      console.log("🎵 BGM 재생 시작됨");
    }).catch((err) => {
      console.error("⚠️ BGM 재생 실패", err);
    });
    set({ audio: bgm, isPlaying: true });
  },

  setVolume: (volume) => {
    set((state) => {
      if (state.audio) {
        state.audio.volume = volume;
      }
      return { volume };
    });
  },

  stopBgm: () => {
    set((state) => {
      if (state.audio) {
        state.audio.pause();
        state.audio.currentTime = 0;
      }
      return { isPlaying: false };
    });
  },
}));

export default useBgmStore;
