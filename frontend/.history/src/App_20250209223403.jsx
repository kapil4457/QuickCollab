import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { AuthenticationForm } from "./pages/AuthenticationForm/AuthenticationForm";
import { Header } from "./components/Header/Header";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<AuthenticationForm />} />
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
