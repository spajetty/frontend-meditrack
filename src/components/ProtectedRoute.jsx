import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute: loading =", loading);
  console.log("ProtectedRoute: user =", user);
  const storedRole = localStorage.getItem("role");
  console.log("ProtectedRoute: storedRole from localStorage =", storedRole);

  if (loading) return null;

  // Prefer user.role from context; fallback to role prop; fallback to localStorage role; fallback to "patient"
  const userRole = user?.role;
  const targetRole = userRole || role || storedRole || "patient";

  console.log("ProtectedRoute: targetRole =", targetRole);

  // Redirect if no user
  if (!user) {
    console.log("ProtectedRoute: no user, redirecting to login");
    return <Navigate to={`/login?role=${targetRole}`} replace />;
  }

  // Redirect if user's role doesn't match required role prop (if given)
  if (role && user.role !== role) {
    console.log(`ProtectedRoute: user.role (${user.role}) !== role prop (${role}), redirecting`);
    return <Navigate to={`/login?role=${targetRole}`} replace />;
  }

  console.log("ProtectedRoute: rendering children");
  return children;
}