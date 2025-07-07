import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OAuthState } from "../hooks/use-oauth";

interface OAuth2Store {
  state: OAuthState | null;
  link: string | null;
  setState: (state: OAuthState) => void;
  setLink: (link: string) => void;
  clear: () => void;
}

export const useOAuth2Store = create<OAuth2Store>()(
  persist(
    (set, get) => ({
      state: null,
      link: null,
      setState: (state: OAuthState) => set({ state }),
      setLink: (link: string) => set({ link }),
      clear: () => set({ state: null, link: null }),
    }),
    {
      name: "oauth2",
      storage: createJSONStorage(() => sessionStorage),
    }
  ) as any
);
