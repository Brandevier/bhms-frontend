import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { requestNotificationPermission } from "../firebase/requestNotificationPermission";
import { fetchNotifications } from "./redux/slice/notificationSlice";

// Import all routes from the config file
import {
  Homepage,
  Login,
  PublicRoutes,
  SharedRoutes,
  AdminRoutes,
  Dashboard,
  StaffLogin,
  EmailVerification,
  PageNotFound,
  StaffList,
  DepartmentsList,
  CalendarComponent,
  StaffDetails,
  PatientRecords,
  PatientLayout,
  Records,
  Lab,
  PuzzleAuthentication,
  Service,
  Store,
  ConsultationDepartment,
  RecordsStats,
  StockItems,
  IssuedItems,
  ExpiredItems,
  DepartmentStore,
  PendingRequests,
} from "./routesConfig";
import DepartmentalStats from "./pages/staff/component/DepartmentalStats";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const data = {
        institution_id: user.institution.id,
        department_id: user.department.id,
      };
      dispatch(fetchNotifications(data));
      requestNotificationPermission(user);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.error("❌ Service Worker registration failed:", err));
    }
  }, [user]);

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
          <Route path="departments/store" element={<DepartmentStore />} />
          <Route path="departments/:id/stats" element={<DepartmentalStats />} />
          <Route path="opd/:id" element={<PatientRecords />} />
          <Route path="consultation/:id" element={<ConsultationDepartment />} />
          <Route path="patient/details/:id" element={<PatientLayout />} />
          <Route path="records/:id" element={<Records />} />
          <Route path="records/:id/statistics" element={<RecordsStats />} />
          <Route path="store/:id" element={<Store />} />
          <Route path="store/:id/stock/items" element={<StockItems />} />
          <Route path="store/:id/issued-items" element={<IssuedItems />} />
          <Route path="store/:id/expired-items" element={<ExpiredItems />} />
          <Route path="store/:id/pending-requests" element={<PendingRequests />} />
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
