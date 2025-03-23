import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider as HeroUIProvider } from "./provider.tsx";
import "@/styles/globals.css";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import LoaderOverlay from "./components/loaderOverlay/LoaderOverlay.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default App;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH2_CLIENT_ID}>
      <Provider store={store}>
        <LoaderOverlay />
        <BrowserRouter>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
