import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../layout/layout"; // Import the layout

const AdminRoutes = () => {
  const admin = useSelector((state) => state.auth.admin); // Check if admin is logged in

  console.log('this is the admin',admin)

  return admin ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/hms/login" />
  );
};

export default AdminRoutes;
