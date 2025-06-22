import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const storedRole = localStorage.getItem("role"); // ← gets "doctor" or "patient"

  if (loading) return null;

  // 👇 If 'role' is provided via props, use it. Otherwise fallback to localStorage role.
  const targetRole = role || storedRole;

  // ✅ If NO user → redirect to login page for that role
  if (!user) return <Navigate to={`/login?role=${targetRole || "patient"}`} replace />;

  // ✅ If user exists but role doesn't match → redirect to correct login
  if (role && user.role !== role) return <Navigate to={`/login?role=${targetRole || "patient"}`} replace />;

  return children;
}