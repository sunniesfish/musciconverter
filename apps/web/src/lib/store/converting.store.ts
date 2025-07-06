import { create } from "zustand";
import { ApiDomain } from "@repo/shared";
interface ConvertingStore {
  apiDomain: ApiDomain;
  isConverting: boolean;
  isSubmitted: boolean;
  setApiDomain: (apiDomain: ApiDomain) => void;
  setIsConverting: (isConverting: boolean) => void;
  setIsSubmitted: (isSubmitted: boolean) => void;
}

export const useConvertingStore = create<ConvertingStore>((set) => ({
  apiDomain: ApiDomain.SPOTIFY,
  isConverting: false,
  isSubmitted: false,
  setApiDomain: (apiDomain: ApiDomain) => set({ apiDomain }),
  setIsConverting: (isConverting: boolean) => set({ isConverting }),
  setIsSubmitted: (isSubmitted: boolean) => set({ isSubmitted }),
}));
