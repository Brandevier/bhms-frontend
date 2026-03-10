// Accounts Department Menu Configuration - Hospital Accounting
import {
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  BankOutlined,
  UserOutlined,
  BarChartOutlined,
  ReconciliationOutlined,
  InsuranceOutlined,
  WalletOutlined,
  CalendarOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";

const accountsMenu = [
  // 1. Main Dashboard
  { key: "accounts-dashboard", label: "Dashboard", icon: <DashboardOutlined />, path: "/shared/accounts/erp-dashboard" },
  
  // 2. Invoices & Billing
  { key: "accounts-invoices", label: "Invoices & Billing", icon: <FileTextOutlined />, path: "/shared/accounts/invoices" },

  // 3. Payments Collection
  { key: "accounts-payments", label: "Payments", icon: <CreditCardOutlined />, path: "/shared/accounts/payment-history" },

  // 4. Patient Accounts - Insured (NHIS) & Self-Pay
  { key: "accounts-patients", label: "Patient Accounts", icon: <UserOutlined />, path: "/shared/accounts/patient-billing" },

  // 5. Insurance Claims (NHIS)
  { key: "accounts-nhis", label: "NHIS Claims", icon: <InsuranceOutlined />, path: "/shared/claims/nhis-claims-services" },

  // 6. Financial Reports
  { key: "accounts-reports", label: "Financial Reports", icon: <BarChartOutlined />, path: "/shared/accounts/revenue-report" },

  // 7. Reconciliation
  { key: "accounts-reconciliation", label: "Reconciliation", icon: <ReconciliationOutlined />, path: "/shared/accounts/bank-reconciliation" },

  // 8. Common - Attendance
  { key: "accounts-attendance", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
];

export default accountsMenu;

