import { useOAuth2Store } from "@/lib/store/oauth2.store";
import { validateOAuthState } from "@/lib/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

export default function OAuth2CallbackPage() {
  const { state, setAuthorizationCode } = useOAuth2Store(
    useShallow((state) => ({
      state: state.state,
      setAuthorizationCode: state.setAuthorizationCode,
    }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const receivedState = urlParams.get("state");

    if (authCode && receivedState && state) {
      if (validateOAuthState(state, receivedState)) {
        setAuthorizationCode(authCode);
        navigate("convert");
      } else {
        // TODO: handle error
      }
    }
  }, [navigate, setAuthorizationCode, state]);
  return <div>OAuth2CallbackPage</div>;
}
