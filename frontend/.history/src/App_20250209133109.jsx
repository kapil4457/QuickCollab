import { BrowserRouter, Routes } from "react-router";
import "./App.css";
import { AuthenticationForm } from "./pages/AuthenticationForm/AuthenticationForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthenticationForm />} />
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="dashboard" element={<Dashboard />}> */}
        {/* <Route index element={<RecentActivity />} /> */}
        {/* <Route path="project/:id" element={<Project />} /> */}
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
