import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  const [auth, setAuth] = useState({
    isLoggedIn: !!storedToken,
    token: storedToken || null,
    role: storedRole || null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      setAuth({ isLoggedIn: true, token, role });
    } else {
      setAuth({ isLoggedIn: false, token: null, role: null });
    }
    setLoading(false); // ✅ Important: after restoring auth, set loading false
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
