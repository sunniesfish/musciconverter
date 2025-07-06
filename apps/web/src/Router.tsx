import { BrowserRouter, Routes, Route } from "react-router";
import OAuth2CallbackPage from "./page/oauth2-page";
import ConvertPage from "./page/convert-page/convert-page";
import { Background } from "./assets/background.common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function Router() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route index element={<ConvertPage />} />
            <Route path="oauth/callback" element={<OAuth2CallbackPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <Background />
    </>
  );
}

export default Router;
