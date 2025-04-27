import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { auth, loading } = useAuth();

  if (loading) return null; // ⏳ Don't rush, wait for loading

  if (!auth.isLoggedIn) return <Navigate to="/login" />;
  if (role && auth.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
