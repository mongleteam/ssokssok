// stores/alarmStore.js
import { create } from "zustand";

export const useAlarmStore = create((set) => ({
  alarms: [],
  addAlarm: (alarm) => set((state) => ({ alarms: [alarm, ...state.alarms] })),
  setAlarms: (alarms) => set({ alarms }),
  clearAlarms: () => set({ alarms: [] }),
}));
