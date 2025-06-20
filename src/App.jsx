import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";     
import RegisterPage from "./pages/RegisterPage"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout><LandingPage /></LandingLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
