import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppLayout from '../layout/layout';

const StaffRoutes = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  return user ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  )
};

export default StaffRoutes;
