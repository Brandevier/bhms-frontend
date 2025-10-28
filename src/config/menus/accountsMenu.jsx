import {
  DashboardOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  DollarOutlined,
  BarChartOutlined,
  PercentageOutlined,
  FundOutlined,
  SwapOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const accountsMenu = [
  { key: "accounts-1", label: "Accounts Dashboard", icon: <DashboardOutlined />, path: "/shared/accounts/statistics" },
  { key: "accounts-2", label: "Billing & Invoicing", icon: <FileTextOutlined />, path: "/shared/accounts/billing-invoicing" },
  { key: "accounts-3", label: "Payment Processing", icon: <CreditCardOutlined />, path: "/accounts/payments" },
  { key: "accounts-4", label: "Expense Management", icon: <DollarOutlined />, path: "/accounts/expenses" },
  { key: "accounts-5", label: "Financial Reports", icon: <BarChartOutlined />, path: "/accounts/reports" },
  { key: "accounts-6", label: "Tax Management", icon: <PercentageOutlined />, path: "/accounts/taxes" },
  { key: "accounts-7", label: "Budget Planning", icon: <FundOutlined />, path: "/accounts/budget" },
  { key: "accounts-8", label: "Bank Reconciliation", icon: <SwapOutlined />, path: "/accounts/reconciliation" },
  { key: "accounts-9", label: "Vendor Management", icon: <ShopOutlined />, path: "/accounts/vendors" },
  { key: "accounts-10", label: "Audit Trail", icon: <SafetyCertificateOutlined />, path: "/accounts/audit" },
  { key: "accounts-11", label: "Financial Settings", icon: <SettingOutlined />, path: "/accounts/settings" },
  { key: "record-9", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
];

export default accountsMenu;