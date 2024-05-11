import React from "react";
import { useAppcontext } from "../context/appContext";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  const { user } = useAppcontext();
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
}

export default ProtectedRoute;
