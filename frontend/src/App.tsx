import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import PostedJobs from "./pages/Dashboard/PostedJobs/PostedJobs";
import Dashboard from "./pages/Dashboard/Dashboard/Dashboard";
import JobMarket from "./pages/Dashboard/JobMarket/JobMarket";
import AppliedJobs from "./pages/Dashboard/AppliedJobs/AppliedJobs";
import Conversations from "./pages/Dashboard/Conversations/Conversations";
import JobsOffered from "./pages/Dashboard/JobsOffered/JobsOffered";
import MyEmployees from "./pages/Dashboard/MyEmployees/MyEmployees";
import UploadRequests from "./pages/Dashboard/UploadRequest/UploadRequests";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AllRoles } from "./utils/enums";

function App() {
  return (
    <>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Logout />} path="/logout" />
        <Route
          element={
            <ProtectedRoute
              children={<PostedJobs />}
              isAccessibleToAll={false}
              requiredRole={[AllRoles.CONTENT_CREATOR]}
            />
          }
          path="/my-posted-jobs"
        />
        <Route
          element={
            <ProtectedRoute
              children={<Dashboard />}
              requiredRole={[]}
              isAccessibleToAll={true}
            />
          }
          path="/dashboard"
        />

        <Route
          element={
            <ProtectedRoute
              children={<JobMarket />}
              requiredRole={[AllRoles.TEAM_MEMBER, AllRoles.JOB_SEEKER]}
              isAccessibleToAll={false}
            />
          }
          path="/all-jobs"
        />
        <Route
          element={
            <ProtectedRoute
              children={<AppliedJobs />}
              requiredRole={[AllRoles.TEAM_MEMBER, AllRoles.JOB_SEEKER]}
              isAccessibleToAll={false}
            />
          }
          path="/applied-jobs"
        />
        <Route
          element={
            <ProtectedRoute
              children={<Conversations />}
              requiredRole={[]}
              isAccessibleToAll={true}
            />
          }
          path="/my-conversations"
        />
        <Route
          element={
            <ProtectedRoute
              children={<JobsOffered />}
              requiredRole={[AllRoles.CONTENT_CREATOR]}
              isAccessibleToAll={false}
            />
          }
          path="/offered-jobs"
        />
        <Route
          element={
            <ProtectedRoute
              children={<MyEmployees />}
              requiredRole={[AllRoles.CONTENT_CREATOR]}
              isAccessibleToAll={false}
            />
          }
          path="/my-employees"
        />
        <Route
          element={
            <ProtectedRoute
              children={<UploadRequests />}
              requiredRole={[AllRoles.CONTENT_CREATOR, AllRoles.TEAM_MEMBER]}
              isAccessibleToAll={false}
            />
          }
          path="/upload-requests"
        />
        <Route element={<Profile />} path="/profile/:userId" />
      </Routes>
    </>
  );
}

export default App;
