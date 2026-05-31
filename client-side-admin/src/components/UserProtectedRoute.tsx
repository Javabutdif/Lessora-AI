import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

interface UserProtectedRouteProps {
  children: ReactNode;
}

export default function UserProtectedRoute({ children }: UserProtectedRouteProps) {
  const user = getCurrentUser();
  const token = localStorage.getItem("lessora-user-token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Made with Bob
