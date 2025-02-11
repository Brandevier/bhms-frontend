import React from "react";
import { Outlet } from "react-router-dom";
import AppLayout from "../../layout/layout";
import BhmsAdminDashboardLayout from "./components/BhmsAdminDashboardLayout";

const Dashboard = () => {
  return <BhmsAdminDashboardLayout/>;
};

export default Dashboard;