import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OAuth2Store {
  state: string | null;
  link: string | null;
  setState: (state: string) => void;
  setLink: (link: string) => void;
  clear: () => void;
}

export const useOAuth2Store = create<OAuth2Store>()(
  persist(
    (set, get) => ({
      state: null,
      link: null,
      setState: (state: string) => set({ state }),
      setLink: (link: string) => set({ link }),
      clear: () => set({ state: null, link: null }),
    }),
    {
      name: "oauth2",
      storage: createJSONStorage(() => sessionStorage),
    }
  ) as any
);
