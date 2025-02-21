import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/landing/Homepage";
import Login from "./pages/auth/Login";
import PublicRoutes from "./routes/PublicRoutes";
import SharedRoutes from "./routes/SharedRoutes"; // Routes for both Admin & Staff
import AdminRoutes from "./routes/AdminRoutes"; // Routes for Admin Only
import Dashboard from "./pages/admin/Dashbaord";
import StaffLogin from "./pages/auth/StaffLogin";
import EmailVerification from "./pages/auth/EmailVerification";
import PageNotFound from "./pages/404/PageNotFound";
import StaffList from "./pages/admin/StaffList";
import DepartmentsList from "./pages/admin/DepartmentsList";
import CalendarComponent from "./pages/admin/components/CalendarComponent";
import StaffDetails from "./pages/admin/StaffDetails";
import PatientRecords from "./pages/departments/opd/patientRecords";
import PatientLayout from "./layout/PatientLayout";
import Records from "./pages/departments/records/Records";
import Lab from "./pages/departments/lab/Lab";
import PuzzleAuthentication from "./pages/auth/PuzzleAuthentication";
import StaffDashboard from "./pages/staff/StaffDashboard";
import Service from "./pages/admin/Service";
import Store from "./pages/departments/store/Store";
import ConsultationDepartment from "./pages/departments/consultation/ConsultationDepartment";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff_login" element={<StaffLogin />} />
          <Route path="/puzzle-authentication" element={<PuzzleAuthentication />} />
          <Route path="/verify-email" element={<EmailVerification />} />
        </Route>

        {/* Shared Routes - Accessible by both Admin & Staff */}
        <Route path="/shared/*" element={<SharedRoutes />}>
          <Route path="departments" element={<DepartmentsList />} />
          <Route path="opd/:id" element={<PatientRecords />} />
          <Route path="consultation/:id" element={<ConsultationDepartment />} />
          <Route path="patient/details/:id" element={<PatientLayout />} />
          <Route path="records/:id" element={<Records />} />
          <Route path="store/:id" element={<Store />} />
          <Route path="lab/:id" element={<Lab />} />
        </Route>

        {/* Admin-Only Routes */}
        <Route path="/admin/*" element={<AdminRoutes />}>
          <Route path="" element={<Dashboard />} />
          <Route path="staffs" element={<StaffList />} />
          <Route path="service" element={<Service />} />
          <Route path="details/:id" element={<StaffDetails />} />
          <Route path="task" element={<CalendarComponent />} />
        </Route>

        {/* 404 Page - Should always be last */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
