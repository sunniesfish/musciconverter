import { create } from "zustand";
interface ConvertingStore {
  isConverting: boolean;
  setIsConverting: (isConverting: boolean) => void;
}

export const useConvertingStore = create<ConvertingStore>((set) => ({
  isConverting: false,
  setIsConverting: (isConverting: boolean) => set({ isConverting }),
}));
