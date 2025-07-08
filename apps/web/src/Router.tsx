import { BrowserRouter, Routes, Route } from "react-router";
import OAuth2CallbackPage from "./page/oauth2-page/oauth2-page";
import ConvertPage from "./page/convert-page/convert-page";
import { Background } from "./assets/background.common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function Router() {
  const queryClient = new QueryClient();
  return (
    <>
      <Background />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ConvertPage />}>
              <Route path="convert" element={<div>converted list</div>} />
            </Route>
            <Route path="oauth/callback" element={<OAuth2CallbackPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default Router;
