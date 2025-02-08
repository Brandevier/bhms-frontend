import React from "react";
import { Outlet } from "react-router-dom";
import AppLayout from "../../layout/layout";

const Dashboard = () => {
  return (
    <AppLayout>
      {/* Nested Routes Render Here */}
      <Outlet />
    </AppLayout>
  );
};

export default Dashboard;