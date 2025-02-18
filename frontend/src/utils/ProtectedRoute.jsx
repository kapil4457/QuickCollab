import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  let location = useLocation();

  if (!isAuthenticated) {
    toast.error("Please login to access this page.");
    return (
      <Navigate to="/login?type=login" state={{ from: location }} replace />
    );
  }
  return children;
};

export default ProtectedRoute;
