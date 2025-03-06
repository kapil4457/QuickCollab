import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import PostedJobs from "./pages/Dashboard/PostedJobs/PostedJobs";
import Dashboard from "./pages/Dashboard/Dashboard/Dashboard";
import JobMarket from "./pages/Dashboard/JobMarket/JobMarket";
import AppliedJobs from "./pages/Dashboard/AppliedJobs/AppliedJobs";
import Conversations from "./pages/Dashboard/Conversations/Conversations";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Logout />} path="/logout" />
      <Route element={<PostedJobs />} path="/my-posted-jobs" />
      <Route element={<Dashboard />} path="/dashboard" />
      <Route element={<PostedJobs />} path="/my-posted-jobs" />
      <Route element={<JobMarket />} path="/all-jobs" />
      <Route element={<AppliedJobs />} path="/applied-jobs" />
      <Route element={<Conversations />} path="/my-conversations" />

      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
