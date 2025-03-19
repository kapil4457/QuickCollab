import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider as HeroUIProvider } from "./provider.tsx";
import "@/styles/globals.css";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import LoaderOverlay from "./components/loaderOverlay/LoaderOverlay.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LoaderOverlay />
      <BrowserRouter>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
