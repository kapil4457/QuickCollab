import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { AuthenticationForm } from "./pages/AuthenticationForm/AuthenticationForm";
import { Header } from "./components/Header/Header";

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
    </>
  );
}

export default App;
