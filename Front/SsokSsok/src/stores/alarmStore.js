// stores/alarmStore.js
import { create } from "zustand";

export const useAlarmStore = create((set) => ({
  alarms: [],
  isLoaded: false,
  setAlarms: (alarmList) => {
    // console.log("🧠 setAlarms 호출됨:", alarmList);
    set({ alarms: alarmList, isLoaded: true });
  },
  addAlarm: (alarm) => {
    // console.log("📨 addAlarm 호출됨:", alarm);
    set((state) => ({
      alarms: [...state.alarms, alarm],
      isLoaded: true,
    }));
  },
  clearAlarms: () => {
    // console.log("🧹 clearAlarms 호출됨");
    set({ alarms: [], isLoaded: false });
  },
  reset: () => set({ alarms: [], isLoaded: false }),
}));
