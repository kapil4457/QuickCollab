import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { AuthenticationForm } from "./pages/AuthenticationForm/AuthenticationForm";
import { Header } from "./components/Header/Header";
import { Bounce, ToastContainer } from "react-toastify";
import ProtectedRoute from "./utils/ProtectedRoute";
import JobsBoard from "./pages/JobsBoard/JobsBoard";
import Logout from "./pages/Logout/Logout";
import Hire from "./pages/Hire/Hire";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<AuthenticationForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/jobs"
            element={<ProtectedRoute children={<JobsBoard />} />}
          />
          <Route
            path="/hire"
            element={<ProtectedRoute children={<Hire />} />}
          />

          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="dashboard" element={<Dashboard />}> */}
          {/* <Route index element={<RecentActivity />} /> */}
          {/* <Route path="project/:id" element={<Project />} /> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;
