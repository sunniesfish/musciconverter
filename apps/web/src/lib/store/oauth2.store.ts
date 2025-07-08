import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OAuthState } from "../hooks/use-oauth";
import { ApiDomain } from "@repo/shared";
interface OAuth2Store {
  state: OAuthState | null;
  link: string | null;
  apiDomain: ApiDomain | null;
  authorizationCode: string | null;
  setState: (state: OAuthState) => void;
  setLink: (link: string) => void;
  setApiDomain: (apiDomain: ApiDomain) => void;
  setAuthorizationCode: (authorizationCode: string) => void;
  clear: () => void;
}

export const useOAuth2Store = create<OAuth2Store>()(
  persist(
    (set) => ({
      state: null,
      link: null,
      apiDomain: ApiDomain.SPOTIFY,
      authorizationCode: null,
      setState: (state: OAuthState) => set({ state }),
      setLink: (link: string) => set({ link }),
      setApiDomain: (apiDomain: ApiDomain) => set({ apiDomain }),
      setAuthorizationCode: (authorizationCode: string) =>
        set({ authorizationCode }),
      clear: () =>
        set({
          state: null,
          link: null,
          apiDomain: ApiDomain.SPOTIFY,
        }),
    }),
    {
      name: "oauth2",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: OAuth2Store) => ({
        state: state.state,
        link: state.link,
        apiDomain: state.apiDomain,
      }),
    }
  )
);
