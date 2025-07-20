import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProductDetailModal from "./components/ProductDetailModal";
import AddProductModal from "./components/AddProductModal";
import Messages from "./components/Messages";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/productdetailmodal" element={<ProductDetailModal />} />
          <Route path="/addproductmodal" element={<AddProductModal />} />
          <Route path="/messages" element={<Messages />} />
          {/* Otras rutas: Register, Dashboard, etc. */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
