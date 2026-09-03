import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Customer/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/admin/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect localhost root to Customer Home */}
        <Route path="/" element={<Navigate to="/customer/home" replace />} />

        {/* Customer */}
        <Route path="/customer/home" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;