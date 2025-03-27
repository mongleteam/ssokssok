import { create } from 'zustand';

export const useVideoStore = create((set) => ({
  session: null,
  myStream: null,
  otherStream: null,
  setSession: (session) => set({ session }),
  setMyStream: (myStream) => set({ myStream }),
  setOtherStream: (otherStream) => set({ otherStream }),
}));