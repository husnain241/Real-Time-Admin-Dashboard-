import React from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // optional
    } catch (err) {
      console.warn("Logout error:", err.response?.data || err.message);
    } finally {
      setAuth({ isLoggedIn: false, role: null });
      localStorage.removeItem("token");
      //navigate("/login");

      navigate("/");
    }
  };

  return (
    <nav style={{ padding: "10px", background: "#f0f0f0" }}>
      <h3 style={{ display: "inline", marginRight: "20px" }}>
        {auth.isLoggedIn
          ? auth.role === "Admin"
            ? "👑 Admin Panel"
            : "🙋‍♂️ User Panel"
          : "🔐 Welcome"}
      </h3>

      {auth.isLoggedIn && (
        <>
          <button onClick={handleLogout} style={{ float: "right" }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
