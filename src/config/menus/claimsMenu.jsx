import {
  DashboardOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  NodeIndexOutlined,
  ExperimentOutlined,
  ToolOutlined,
  SyncOutlined,
  UserSwitchOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const claimsMenu = [
  { key: "claims-dashboard", label: "Claims Dashboard", icon: <DashboardOutlined />, path: "/shared/claims/dashboard" },
  { key: "claims-1", label: "Patient Claims Desk", icon: <FileDoneOutlined />, path: "/shared/claims/patient-claims-desk" },
  // { key: "claims-2", label: "Claim Items", icon: <AppstoreOutlined />, path: "/shared/claims/items" },
  { key: "claims-3", label: "Medications", icon: <MedicineBoxOutlined />, path: "/shared/claims/medications" },
  { key: "claims-4", label: "ICD-10 Codes", icon: <ProfileOutlined />, path: "/shared/claims/diagnosis" },
  { key: "claims-5", label: "GDRG Mappings", icon: <NodeIndexOutlined />, path: "/shared/claims/mappings" },
  { key: "claims-9", label: "Procedures", icon: <NodeIndexOutlined />, path: "/shared/claims/dgrg-codes" },
  { key: "ward-7", label: "Duty Schedule", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },

  { key: "claims-6", label: "Lab Tarrifs", icon: <ExperimentOutlined />, path: "/shared/claims/lab-tarrifs" },
  { key: "claims-7", label: "Procedures", icon: <ToolOutlined />, path: "/shared/claims/procedures" },
  { key: "claims-8", label: "Vetting Module", icon: <SyncOutlined />, path: "/shared/claims/vetting" },
  { key: "record-9", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
];

export default claimsMenu;