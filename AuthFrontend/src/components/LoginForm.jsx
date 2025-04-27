import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../App.css"; // ✅ Adjust path as needed

const LoginForm = () => {
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      const role = response.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("email", response.data.email); // ✅ ADD THIS
      localStorage.setItem("role", role); // optional

      setAuth({
        isLoggedIn: true,
        token,
        role,
      });

      if (role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="form-box">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-text">{error}</p>}

      <div className="link-box">
        <p>Don't have an account?</p>
        <NavLink to="/register" className="auth-button">
          Sign Up
        </NavLink>
      </div>
    </div>
  );
};

export default LoginForm;
