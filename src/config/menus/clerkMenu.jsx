import {
  DashboardOutlined,
  UserAddOutlined,
  TeamOutlined,
  FileAddOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
  RetweetOutlined,
  SolutionOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const clerkMenu = [
  {
    key: "clerk-1",
    label: "Clerk Dashboard",
    icon: <DashboardOutlined />,
    path: "/shared/accounts/statistics",
  },
  // {
  //   key: "clerk-2",
  //   label: "Patient Registration",
  //   icon: <UserAddOutlined />,
  //   path: "/shared/clerk/register-patient",
  // },
  {
    key: "clerk-3",
    label: "Patient Bill Records",
    icon: <TeamOutlined />,
    path: "/shared/clerk/patient-bills",
  },
  {
    key: "clerk-5",
    label: "NHIA Claims & Service Billing",
    icon: <FileTextOutlined />,
    path: "/shared/clerk/nhia-claims-services",
  },
  // {
  //   key: "clerk-6",
  //   label: "Payment Verification",
  //   icon: <CreditCardOutlined />,
  //   path: "/shared/clerk/payment-verification",
  // },
  // {
  //   key: "clerk-7",
  //   label: "Queue Management",
  //   icon: <ScheduleOutlined />,
  //   path: "/shared/clerk/queue-management",
  // },
  // {
  //   key: "clerk-8",
  //   label: "Referrals",
  //   icon: <RetweetOutlined />,
  //   path: "/shared/clerk/referrals",
  // },
  // {
  //   key: "clerk-9",
  //   label: "Reports & Statistics",
  //   icon: <BarChartOutlined />,
  //   path: "/shared/clerk/reports",
  // },
  // {
  //   key: "clerk-10",
  //   label: "Department Coordination",
  //   icon: <SolutionOutlined />,
  //   path: "/shared/clerk/department-coordination",
  // },
  // {
  //   key: "clerk-11",
  //   label: "Settings",
  //   icon: <SettingOutlined />,
  //   path: "/shared/clerk/settings",
  // },
  {
    key: "clerk-12",
    label: "Attendance",
    icon: <UserSwitchOutlined />,
    path: "/shared/attendance",
  },
];

export default clerkMenu;
