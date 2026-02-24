// src/config/menus/adminMenu.js
import {
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  TeamOutlined,
  MessageOutlined,
  FileTextOutlined,
  CalendarOutlined,
  SettingOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  CloudUploadOutlined,
  ApiOutlined,
  LockOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const adminMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/admin",
  },
  {
    key: "patientManagement",
    label: "Patient Management",
    icon: <UserOutlined />,
    children: [
      { key: "patientRecords", label: "Patient Records", path: "/admin/patient-report" },
      { key: "appointments", label: "Appointments", path: "/admin/appointments" },
      { key: "admissions", label: "Admissions", path: "/shared/admissions/all" },
    ],
  },
  {
    key: "medicalServices",
    label: "Medical Services",
    icon: <MedicineBoxOutlined />,
    children: [
      { key: "departments", label: "Departments", path: "/shared/departments" },
      { key: "services", label: "Services", path: "/admin/service" },
      { key: "wards", label: "Wards & Beds", path: "/admin/wards" },
    ],
  },
  {
    key: "billing",
    label: "Billing & Finance",
    icon: <DollarOutlined />,
    children: [
      { key: "invoices", label: "Invoices", path: "/shared/departments/accounts" },
      { key: "insurance", label: "Insurance Claims", path: "/admin/insurance" },
      { key: "payments", label: "Payment Records", path: "/admin/payments" },
    ],
  },
  {
    key: "staff",
    label: "Staff Management",
    icon: <TeamOutlined />,
    children: [
      { key: "staffDirectory", label: "Staff Directory", path: "/admin/staffs" },
      { key: "attendance", label: "Attendance", path: "/admin/attendance" },
      { key: "schedules", label: "Schedules", path: "/admin/schedules" },
    ],
  },
  {
    key: "communication",
    label: "Communication",
    icon: <MessageOutlined />,
    children: [
      { key: "messaging", label: "Messaging", path: "/shared/chat" },
      { key: "chat", label: "Call Chat", path: "/shared/communication/call-chat" },
      { key: "departmentCall", label: "Department Video Call", path: "/shared/communication/department-call" },
      { key: "notifications", label: "Notifications", path: "/admin/notifications" },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: <FileTextOutlined />,
    children: [
      { key: "financialReports", label: "Financial", path: "/admin/reports/financial" },
      { key: "medicalReports", label: "Medical", path: "/admin/reports/medical" },
      { key: "operationalReports", label: "Operational", path: "/admin/reports/operational" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      { key: "backups", label: "Backups", icon: <CloudUploadOutlined />, path: "/admin/settings/backups" },
      { key: "systemConfig", label: "System Configuration", icon: <SettingOutlined />, path: "/admin/settings/system" },
      { key: "userRoles", label: "User Roles & Permissions", icon: <LockOutlined />, path: "/admin/settings/roles" },
      { key: "auditLogs", label: "Audit Logs", icon: <SafetyCertificateOutlined />, path: "/admin/settings/audit-logs" },
      { key: "dataManagement", label: "Data Management", icon: <DatabaseOutlined />, path: "/admin/settings/data" },
      { key: "integrations", label: "Integration Settings", icon: <ApiOutlined />, path: "/admin/settings/integrations" },
    ],
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: <CalendarOutlined />,
    path: "/admin/calendar",
  },
];

export default adminMenu;
