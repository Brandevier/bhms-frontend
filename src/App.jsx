import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/landing/Homepage';
import Login from './pages/auth/Login';
import AdminRoutes from './routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';
import StaffRoutes from './routes/StaffRoutes';
import Dashboard from './pages/admin/Dashbaord';
import StaffLogin from './pages/auth/StaffLogin';
import EmailVerification from './pages/auth/EmailVerification';
import PageNotFound from './pages/404/PageNotFound';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff_login" element={<StaffLogin />} />
          <Route path="/verify-email" element={<EmailVerification />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoutes />}>
          {/* <Route path="/admin" element={<Dashboard />} /> */}
        </Route>

        {/* Staff Routes */}
        <Route element={<StaffRoutes />}>
          {/* Add staff routes here */}
        </Route>

        {/* 404 Page - This should always be the last route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
