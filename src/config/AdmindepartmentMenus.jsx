// src/config/departmentMenus.js
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MessageOutlined,
  InboxOutlined,
  FileTextOutlined,
  CalendarOutlined,
  WechatOutlined,
  DollarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const AdminDepartmentMenus = {
  // ✅ Admin has a rich full menu
  "Admin": [
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
        { key: "callChat", label: "Call Chat", path: "/shared/communication/call-chat" },
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
      key: "calendar",
      label: "Calendar",
      icon: <CalendarOutlined />,
      path: "/admin/calendar",
    },
  ],

  // ✅ Example: Pharmacy department
  "Pharmacy": [
    { key: "prescriptions", label: "Prescriptions", icon: <MedicineBoxOutlined />, path: "/pharmacy/prescriptions" },
    { key: "inventory", label: "Inventory", icon: <AppstoreOutlined />, path: "/pharmacy/inventory" },
    { key: "billing", label: "Billing", icon: <DollarOutlined />, path: "/pharmacy/billing" },
  ],

  // ✅ Example: Lab department
  "Lab": [
    { key: "tests", label: "Lab Tests", icon: <FileTextOutlined />, path: "/lab/tests" },
    { key: "results", label: "Results", icon: <InboxOutlined />, path: "/lab/results" },
  ],

  // add other departments (Accounts, Radiology, Nursing, etc.)
};

export default AdminDepartmentMenus;
