import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoutes = () => {
  const { user, admin } = useSelector((state) => state.auth);

  return user || admin ? <Navigate to="/shared/departments" /> : <Outlet />;
};

export default PublicRoutes;
