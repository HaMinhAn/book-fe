import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  console.log(user);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has admin role
  const isAdmin = user?.roles?.some((role: any) => role === "ROLE_ADMIN");

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
