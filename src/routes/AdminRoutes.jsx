import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoutes = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  return user && user.role === 'admin' ? <Outlet /> : <Outlet />;
};

export default AdminRoutes;
