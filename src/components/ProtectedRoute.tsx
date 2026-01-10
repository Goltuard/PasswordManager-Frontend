import { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const unlocked = sessionStorage.getItem("unlocked") === "true";
  const token = localStorage.getItem("token");

  if (!unlocked || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
