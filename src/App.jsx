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
import StaffList from './pages/admin/StaffList';
import DepartmentsList from './pages/admin/DepartmentsList';
import CalendarComponent from './pages/admin/components/CalendarComponent';
import StaffDetails from './pages/admin/StaffDetails';
import PatientRecords from './pages/departments/opd/patientRecords';
import PatientLayout from './layout/PatientLayout';
import Records from './pages/departments/records/Records';



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
        <Route path="/admin/*" element={<AdminRoutes />}>
          <Route path="" element={<Dashboard />} />
          <Route path="staffs" element={<StaffList />} />
          <Route path="details/:id" element={<StaffDetails />} />
          <Route path="departments" element={<DepartmentsList />} />
          <Route path="departments/opd" element={<PatientRecords />} />
          <Route path="patient/details/:id" element={<PatientLayout />} />
          <Route path="records/:id" element={<Records />} />

          <Route path="task" element={<CalendarComponent />} />
          
          
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
