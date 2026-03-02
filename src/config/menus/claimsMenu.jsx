import {
  DashboardOutlined,
  BankOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  NodeIndexOutlined,
  ExperimentOutlined,
  ToolOutlined,
  SyncOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
  HistoryOutlined,
  AuditOutlined,
  FileExcelOutlined
} from "@ant-design/icons";

const claimsMenu = [
  { key: "claims-erp", label: "Claims ERP Dashboard", icon: <BankOutlined />, path: "/shared/claims/erp-dashboard" },
  { key: "claims-dashboard", label: "Claims Overview", icon: <DashboardOutlined />, path: "/shared/claims/dashboard" },
  { key: "claims-1", label: "Patient Claims Desk", icon: <FileDoneOutlined />, path: "/shared/claims/patient-claims-desk" },
  { key: "claims-3", label: "NHIA Medications", icon: <MedicineBoxOutlined />, path: "/shared/claims/medications" },
  { key: "claims-4", label: "ICD-10 Codes", icon: <ProfileOutlined />, path: "/shared/claims/diagnosis" },
  { key: "claims-5", label: "ICD-10 to GDRG", icon: <NodeIndexOutlined />, path: "/shared/claims/mappings" },
  { key: "claims-6", label: "GDRG Codes", icon: <ToolOutlined />, path: "/shared/claims/dgrg-codes" },
  { key: "claims-7", label: "Lab Tariffs", icon: <ExperimentOutlined />, path: "/shared/claims/lab-tarrifs" },
  { key: "claims-8", label: "Vetting Module", icon: <AuditOutlined />, path: "/shared/claims/vetting" },
  { key: "claims-9", label: "Export & Submit", icon: <FileExcelOutlined />, path: "/shared/claims/export" },
  { key: "claims-10", label: "Claims History", icon: <HistoryOutlined />, path: "/shared/claims/history" },
  { key: "ward-7", label: "Duty Schedule", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
  { key: "record-9", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
];

export default claimsMenu;
