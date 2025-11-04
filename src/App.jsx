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
  ANCRegistration,
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
import Appointments from "./pages/admin/appointments/Appointments";
import InsuranceClaims from "./pages/admin/components/InsuranceClaims";
import InstitutionRegistration from "./components/InstitutionRegistration";
import TimeTable from "./pages/departments/shared/TimeTable";
import ClaimsDashboard from "./pages/departments/claims/ClaimsDashboard";
import ICD10GDRGManager from "./pages/departments/claims/ICD10GDRGManager";
import NHIAMedicationsManager from "./pages/departments/claims/NHIAMedicationsManager";
import ICD10Diagnosis from "./pages/departments/claims/icd_10/ICD10Diangosis";
import AllPatientsRecords from "./pages/departments/records/new_patients/AllPatientsRecords";
import CreateTemplatePage from "./pages/departments/lab/form_templates/CreateTemplatePage";
import TemplateManagementPage from "./pages/departments/lab/form_templates/TemplateManagementPage";
import LabTestsPendingPage from "./pages/departments/lab/form_templates/LabTestsPendingPage/LabTestsPendingPage";
import LabRanges from "./pages/departments/lab/ranges/LabRanges";
import LabStats from "./pages/departments/lab/form_templates/LabStats";
import PendingPrescriptions from "./pages/departments/pharmacy/PendingPrescriptions/PendingPrescriptions";
// import PrescriptionDetails from "./pages/departments/pharmacy/PrescriptionDetails";
import PrescriptionDetails from "./pages/departments/pharmacy/PrescriptionDetails/PrescriptionDetails";
import PrescriptionPatterns from "./pages/departments/pharmacy/PrescriptionPatterns";
import PatientCounseling from "./pages/departments/pharmacy/PatientCounseling";
import RejectedPrescriptions from "./pages/departments/pharmacy/RejectedPrescriptions";
import Attendance from "./hooks/Attendance";
import NurseStationPage from "./hooks/nursesStation/NurseStationPage";
import DgrgCodes from "./pages/departments/claims/DgrgCodes";
import LabInvestigationTarrifs from "./pages/departments/claims/lab_tarrif/LabInvestigationTarrifs";
import ProfileDetails from "./pages/staff/ProfileDetails";
import PatientClaimsDesk from "./pages/departments/claims/PatientClaimsDesk";
import { fetchAllDiagnoses } from "./redux/slice/icd10DdiangosisSlice";
import PatientFolderDetails from "./pages/departments/records/PatientFolderDetails";
import InsuranceProviders from "./pages/departments/records/InsuranceProviders";
import MinorProcedureDocumentation from "./hooks/minorProcedures/MinorProcedureDocumentation";
import FaceScanAttendance from "./pages/attendance/FaceScanAttendance";
import NHIAVettingModule from "./pages/departments/claims/vetting/NHIAVettingModule";
import AccountStatistics from "./pages/departments/accounts/AccountStatistics";
import BillingInvoicing from "./pages/departments/accounts/billing&Invoice/BillingInvoicing";
import UltraSoundStats from "./pages/departments/maternity/ultrasound/UltraSoundStats";
import DepartmentLabStats from "./pages/departments/maternity/components/DepartmentLabStats";
import PatientAnalysis from "./pages/departments/information_manager/PatientAnalysis";
import DiagnosisAnalysis from "./pages/departments/information_manager/DiagnosisAnalysis";
import BedStatisticsDashboard from "./pages/departments/information_manager/BedStatisticsDashboard"; 
import PatientSummaryDashboard from "./pages/departments/information_manager/patientSummary/PatientSummaryDashboard";
import DepartmentDetails from "./pages/admin/department_settings/DepartmentDetails";
import SessionManager from "./hooks/session/SessionManager";
import RecentLabTests from "./pages/departments/lab/form_templates/RecentLabTests";
import VisitLabTests from "./pages/departments/lab/form_templates/VisitlabTest";
import PrescriptionDispenseHistory from "./pages/departments/pharmacy/PrescriptionDispenseHistory/PrescriptionDispenseHistory";
import WardBedAllocation from "./pages/departments/ward/WardBedAllocation";
import HandOverNote from "./pages/departments/hand_over_note/HandOverNote";
import LabAnalytics from "./pages/departments/information_manager/labAnalytics/LabAnalytics";
import MaternityAnalytics from "./pages/departments/information_manager/maternity_analytics/MaternityAnalytics";
import ClaimsExportHistory from "./pages/departments/claims/History/ClaimsExportHistory";
import XmlViewerPage from "./pages/departments/claims/History/components/XmlViewerPage";


 
const App = () => {
  const user = useSelector((state) => state.auth.user || state.auth.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const data = {
        institution_id: user?.institution?.id,
        department_id: user?.department?.id || null,
      };
      dispatch(fetchNotifications(data));
      // dispatch(fetchAllDiagnoses());
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

      {/* <SessionManager/> */}
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
            <Route path="department/details/:id" element={<DepartmentDetails />} />
            <Route path="departments/store" element={<DepartmentStore />} />
            <Route path="communication/call-chat" element={<CallComponent />} />
            <Route path="departments/accounts" element={<InstitutionAccounts />} />
            <Route path="departments/accounts/:id/bill-history" element={<PatientBillHistory />} />
            <Route path="attendance" element={<FaceScanAttendance />} />
            <Route path="nursesStation" element={<NurseStationPage />} />
            <Route path="profile" element={<ProfileDetails />} />
            <Route path="procedure" element={<MinorProcedureDocumentation />} />

            {/* PHARMACY */}
            <Route path="departments/pharmacy" element={<Pharmacy />} />
            <Route path="departments/pharmacy/pending" element={<PendingPrescriptions />} />
            <Route path="departments/pharmacy/prescriptions/patterns" element={<PrescriptionPatterns />} />
            <Route path="departments/pharmacy/prescriptions/rejected" element={<RejectedPrescriptions />} />
            <Route path="departments/pharmacy/counsel" element={<PatientCounseling />} />
            <Route path="departments/pharmacy/prescriptions/:visit_id" element={<PrescriptionDetails />} />
            <Route path="departments/pharmacy/dispensed" element={<PrescriptionDispenseHistory />} />





            <Route path="departments/:id/shift-schedule" element={<HMSStaffShiftSchedule />} />
            <Route path="departments/:id/stats" element={<DepartmentalStats />} />
            <Route path="opd/:id" element={<PatientRecords />} />
            <Route path="consultation/:id" element={<ConsultationDepartment />} />
            <Route path="patient/details/:id" element={<PatientLayout />} />
            <Route path="records/:id" element={<Records />} />
            <Route path="records/folder/:id" element={<PatientFolderDetails />} />
            <Route path="records/:id/statistics" element={<RecordsStats />} />
            <Route path="store/:id" element={<Store />} />
            <Route path="store/:id/stock/items" element={<StockItems />} />
            <Route path="store/:id/issued-items" element={<IssuedItems />} />
            <Route path="store/:id/expired-items" element={<ExpiredItems />} />
            <Route path="store/:id/pending-requests" element={<PendingRequests />} />
            {/* <Route path="lab/:id" element={<Lab />} /> */}
            <Route path="anc/registration/" element={<ANCRegistration />} />
            <Route path="admissions/all" element={<InstitutionAdmissions />} />
            <Route path="departments/time-table" element={<TimeTable />} />
            <Route path="records" element={<AllPatientsRecords />} />
            <Route path="insurance-providers" element={<InsuranceProviders />} />


            {/* LAB ROUTES */}
            <Route path="lab/templates/create" element={<CreateTemplatePage />} />
            <Route path="lab/templates/manage" element={<TemplateManagementPage />} />
            <Route path="lab/tests/pending" element={<LabTestsPendingPage />} />
            <Route path="lab/ranges" element={<LabRanges />} />
            <Route path="lab/statistics" element={<LabStats />} />
            <Route path="department/lab/stats" element={<DepartmentLabStats />} />
            <Route path="lab/tests/recent" element={<RecentLabTests />} />
            <Route path="lab/visit/:visit_id/tests" element={<VisitLabTests />} />



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
            <Route path="claims/dashboard" element={<ClaimsDashboard />} />
            <Route path="claims/mappings" element={<ICD10GDRGManager />} />
            <Route path="claims/medications" element={<NHIAMedicationsManager />} />
            <Route path="claims/diagnosis" element={<ICD10Diagnosis />} />
            <Route path="claims/dgrg-codes" element={<DgrgCodes />} />
            <Route path="claims/lab-tarrifs" element={<LabInvestigationTarrifs />} />
            <Route path="claims/patient-claims-desk" element={<PatientClaimsDesk />} />
            <Route path="claims/vetting" element={<NHIAVettingModule />} />
            <Route path="claims/history" element={<ClaimsExportHistory />} />
            <Route path="claims/history/xml-viewer" element={<XmlViewerPage />} />

            {/* ACCOUNTS DEPARTMENT */}
            <Route path="accounts/statistics" element={<AccountStatistics />} />
            <Route path="accounts/billing-invoicing" element={<BillingInvoicing />} />


            {/* DYNAMIC WARDS */}
            <Route path="wards/beds" element={<WardBedAllocation />} />
            <Route path="wards/hand-over-notes" element={<HandOverNote />} />

            {/* ULTRA-SOUND */}
              <Route path="ultra-sound/stats" element={<UltraSoundStats />} />


            {/* INFORMATION MANAGER */}
            <Route path="information-manager/visualization/patient-analysis" element={<PatientAnalysis />} />
            <Route path="information-manager/diagnosis-analysis" element={<DiagnosisAnalysis />} />
            <Route path="information-manager/visualization/beds-analytics" element={<BedStatisticsDashboard />} />
             <Route path="information-manager/visualization/patient-summary" element={<PatientSummaryDashboard />} />
            <Route path="information-manager/lab/analytics" element={<LabAnalytics />} />
            <Route path="information-manager/maternity/analytics" element={<MaternityAnalytics />} />
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
