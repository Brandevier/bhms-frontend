import Homepage from "./pages/landing/Homepage";
import Login from "./pages/auth/Login";
import PublicRoutes from "./routes/PublicRoutes";
import SharedRoutes from "./routes/SharedRoutes";
import AdminRoutes from "./routes/AdminRoutes";
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
import Service from "./pages/admin/Service";
import Store from "./pages/departments/store/Store";
import ConsultationDepartment from "./pages/departments/consultation/ConsultationDepartment";
import RecordsStats from "./pages/departments/records/RecordsStats";
import StockItems from "./pages/departments/store/StockItems";
import IssuedItems from "./pages/departments/store/IssuedItems";
import ExpiredItems from "./pages/departments/store/ExpiredItems";
import DepartmentStore from "./pages/departments/store/DepartmentStore";
import PendingRequests from "./pages/departments/store/PendingRequests";
import HMSStaffShiftSchedule from "./hooks/HMSStaffShiftSchedule";
import MaternityRegistration from "./pages/departments/maternity/A&C/MaternityRegistration";
import PatientReport from "./hooks/PatientReport";
import ChatUI from "./pages/chat/ChatUI";

// Export all imports
export {
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
  HMSStaffShiftSchedule,
  MaternityRegistration,
  PatientReport,
  ChatUI
};
