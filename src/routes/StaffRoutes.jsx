import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StaffRoutes = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  return user && (user.role === 'staff' || user.role === 'admin') ? <Outlet /> : <Navigate to="/login" />;
};

export default StaffRoutes;
