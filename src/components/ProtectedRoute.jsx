import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return null; 

  if (!user) return <Navigate to={`/login?role=${role}`} replace />;
  if (role && user.role !== role) return <Navigate to={`/login?role=${role}`} replace />;

  return children;
}
