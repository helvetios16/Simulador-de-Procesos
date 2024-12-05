import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface GlobalTime {
  time: number;
  incrementTime: () => void;
  resetTime: () => void;
}

export const useGlobalTime = create<GlobalTime>()(
  devtools((set) => ({
    time: 0,
    incrementTime: () => set((state) => ({ time: state.time + 1 })),
    resetTime: () => set({ time: 0 }),
  })),
);
