import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/landing/Homepage';
import Login from './pages/auth/Login';
import AdminRoutes from './routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';
import StaffRoutes from './routes/StaffRoutes';
import Dashboard from './pages/admin/Dashbaord';


// Import other pages as needed

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoutes />}> 
          {/* Dashboard Layout */}
          <Route path="/admin" element={<Dashboard />}>
            {/* Nested Admin Routes */}
            {/* <Route path="dashboard" element={<DashboardStats />} />
            <Route path="departments" element={<Departments />} />
            <Route path="chat" element={<MessageInterface />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="department/details" element={<DepartmentDetails />} />
            <Route path="department/patient/:id" element={<PatientDashboardLayout />} />
            <Route path="staffs" element={<Staffs />} />
            <Route path="staff/details" element={<StaffDetails />} /> */}
            
            {/* Add more nested admin routes here */}
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<StaffRoutes />}>
          {/* Add staff routes here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;