import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../layout/layout";

const SharedRoutes = () => {
  const { user, admin } = useSelector((state) => state.auth);

  return user || admin ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default SharedRoutes;
