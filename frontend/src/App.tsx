import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Login from "./pages/Login/Login";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { selfDetails } from "./store/controllers/UserController";
import Logout from "./pages/Logout/Logout";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    selfDetails(dispatch);
  }, []);
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Logout />} path="/logout" />

      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
