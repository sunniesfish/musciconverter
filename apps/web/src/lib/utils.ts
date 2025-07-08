import type { AuthRequiredResponse } from "@repo/shared";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OAuthState } from "./hooks/use-oauth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleOAuthCallback(response: AuthRequiredResponse) {
  if (!("authUrl" in response)) {
    return;
  }
  window.location.href = response.authUrl;
}

export function validateOAuthState(state: OAuthState, receivedState: string) {
  try {
    if (!receivedState) {
      return false;
    }
    const parsedState = JSON.parse(receivedState);
    return state.domain === parsedState.domain && state.id === parsedState.id;
  } catch {
    return false;
  }
}
