import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { requestNotificationPermission } from "../firebase/requestNotificationPermission";
import { fetchNotifications } from "./redux/slice/notificationSlice";
// Import all routes from the config file
import { CallProvider } from "./context/CallContext";
import CallDialog from "./modal/CallDialog";



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
  HMSStaffShiftSchedule,
  MaternityRegistration,
  PatientReport,
  ChatUI,
  Pharmacy,
  InstitutionAccounts,
  PatientBillHistory,
  InstitutionAdmissions,
  BedManagement,
  QrAttendance
} from "./routesConfig";
import DepartmentalStats from "./pages/staff/component/DepartmentalStats";
import SmsManagement from "./pages/admin/components/SmsManagement";
import CallComponent from "./pages/admin/components/Call";
import DepartmentCallHandler from "./components/DepartmentCallHandler"
import ORscheduling from "./pages/departments/theatre/ORscheduling";
import PreOpManagement from "./pages/departments/theatre/Pre-Op Management/PreOpManagement";
import RoomStatus from "./pages/departments/theatre/roomstatus_page/RoomStatus";
import ResourceAllocation from "./pages/departments/theatre/resourceAllocation/ResourceAllocationPage";
import IntraOpDocumentation from "./pages/departments/theatre/IntOp/IntraOpDocumentation";
import SurgicalChat from "./pages/departments/theatre/chat/SurgicalChat";
import PostOpTracking from "./pages/departments/theatre/postOPtracking/PostOpTracking";
import Appointments from "./pages/admin/components/Appointments";
import InsuranceClaims from "./pages/admin/components/InsuranceClaims";
import InstitutionRegistration from "./components/InstitutionRegistration";
import TimeTable from "./pages/departments/shared/TimeTable";
import ClaimsDashboard from "./pages/departments/claims/ClaimsDashboard";
import ICD10GDRGManager from "./pages/departments/claims/ICD10GDRGManager";
import NHIAMedicationsManager from "./pages/departments/claims/NHIAMedicationsManager";
import ICD10Diagnosis from "./pages/departments/claims/ICD10Diangosis";
import AllPatientsRecords from "./pages/departments/records/AllPatientsRecords";
import CreateTemplatePage from "./pages/departments/lab/form_templates/CreateTemplatePage";
import TemplateManagementPage from "./pages/departments/lab/form_templates/TemplateManagementPage";
import LabTestsPendingPage from "./pages/departments/lab/form_templates/LabTestsPendingPage";
import LabRanges from "./pages/departments/lab/ranges/LabRanges";
import LabStats from "./pages/departments/lab/form_templates/LabStats";
import PendingPrescriptions from "./pages/departments/pharmacy/PendingPrescriptions";
import PrescriptionDetails from "./pages/departments/pharmacy/PrescriptionDetails";
import PrescriptionPatterns from "./pages/departments/pharmacy/PrescriptionPatterns";
import PatientCounseling from "./pages/departments/pharmacy/PatientCounseling";
import RejectedPrescriptions from "./pages/departments/pharmacy/RejectedPrescriptions";





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
      // requestNotificationPermission(user);
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.error("❌ Service Worker registration failed:", err));
    }
  }, [user]);

  return (
    <CallProvider>
      <DepartmentCallHandler userData={user} />
      <CallDialog />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/hms/login" element={<Login />} />
            <Route path="/hms/staff_login" element={<StaffLogin />} />
            <Route path="/hms/puzzle-authentication" element={<PuzzleAuthentication />} />
            <Route path="/hms/verify-email" element={<EmailVerification />} />
            <Route path="/hms/institution-registration" element={<InstitutionRegistration />} />
          </Route>

          {/* Shared Routes - Accessible by both Admin & Staff */}
          <Route path="/shared/*" element={<SharedRoutes />}>
            <Route path="departments" element={<DepartmentsList />} />
            <Route path="departments/store" element={<DepartmentStore />} />
            <Route path="communication/call-chat" element={<CallComponent />} />
            <Route path="departments/accounts" element={<InstitutionAccounts />} />
            <Route path="departments/accounts/:id/bill-history" element={<PatientBillHistory />} />

            {/* PHARMACY */}
            <Route path="departments/pharmacy" element={<Pharmacy />} />
            <Route path="departments/pharmacy/pending" element={<PendingPrescriptions />} />
            <Route path="departments/pharmacy/prescriptions/patterns" element={<PrescriptionPatterns />} />
            <Route path="departments/pharmacy/prescriptions/rejected" element={<RejectedPrescriptions />} />
            <Route path="departments/pharmacy/counsel" element={<PatientCounseling />} />
            <Route path="departments/pharmacy/prescriptions/:visit_id" element={<PrescriptionDetails />} />





            <Route path="departments/:id/shift-schedule" element={<HMSStaffShiftSchedule />} />
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
            {/* <Route path="lab/:id" element={<Lab />} /> */}
            <Route path="maternity/registration/:id" element={<MaternityRegistration />} />
            <Route path="admissions/all" element={<InstitutionAdmissions />} />
            <Route path="departments/time-table" element={<TimeTable />} />
            <Route path="records" element={<AllPatientsRecords />} />


            {/* LAB ROUTES */}
            <Route path="lab/templates/create" element={<CreateTemplatePage />} />
            <Route path="lab/templates/manage" element={<TemplateManagementPage />} />
            <Route path="lab/tests/pending" element={<LabTestsPendingPage />} />
            <Route path="lab/ranges" element={<LabRanges />} />
            <Route path="lab/statistics" element={<LabStats />} />



            {/* THEATRE */}
            <Route path="surgery/scheduling" element={<ORscheduling />} />
            <Route path="surgery/room-status" element={<RoomStatus />} />
            <Route path="surgery/resource-allocation" element={<ResourceAllocation />} />
            <Route path="surgery/pre-op" element={<PreOpManagement />} />
            <Route path="surgery/intra-op" element={<IntraOpDocumentation />} />
            <Route path="surgery/chat" element={<SurgicalChat />} />
            <Route path="surgery/post-op" element={<PostOpTracking />} />

            {/* CHATUI   */}
            <Route path="chat" element={<ChatUI />} />

            {/* CLAIMS */}
            <Route path="claims/:id/dashboard" element={<ClaimsDashboard />} />
            <Route path="claims/:id/mappings" element={<ICD10GDRGManager />} />
            <Route path="claims/:id/medications" element={<NHIAMedicationsManager />} />
            <Route path="claims/:id/diagnosis" element={<ICD10Diagnosis />} />


          </Route>

          {/* Admin-Only Routes */}
          <Route path="/admin/*" element={<AdminRoutes />}>
            <Route path="" element={<Dashboard />} />
            <Route path="staffs" element={<StaffList />} />
            <Route path="attendance" element={<QrAttendance />} />
            <Route path="patient-report" element={<PatientReport />} />
            <Route path="sms-management" element={<SmsManagement />} />
            <Route path="service" element={<Service />} />
            <Route path="details/:id" element={<StaffDetails />} />
            <Route path="task" element={<CalendarComponent />} />
            <Route path="wards" element={<BedManagement />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="insurance" element={<InsuranceClaims />} />
          </Route>

          {/* 404 Page - Should always be last */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </CallProvider>
  );
};

export default App;
