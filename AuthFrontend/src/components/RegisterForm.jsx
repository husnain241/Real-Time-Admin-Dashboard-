import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css"; // ✅ Shared styles

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", { email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      const backendError = err.response?.data;

      const readable =
        typeof backendError === "string"
          ? backendError
          : backendError?.msg || "Registration failed";

      setError(readable);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister} className="form-box">
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">
          Register
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <div className="link-box">
        Already have an account? <NavLink to="/login">Login</NavLink>
      </div>
    </div>
  );
};

export default RegisterForm;
