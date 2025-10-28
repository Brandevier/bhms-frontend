import {
  UserSwitchOutlined,
  ShopOutlined,
  CalendarOutlined,
  WechatOutlined,
  BarChartOutlined,
  BankOutlined,
  BookOutlined
} from "@ant-design/icons";

const recordsMenu = [
  { key: "records-2", label: "Registration", icon: <UserSwitchOutlined />, path: "/shared/records" },
  { key: "records-10", label: "Active Visits", icon: <UserSwitchOutlined />, path: "/shared/records/registration" },
  { key: "records-4", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
  // { key: "records-7", label: "Reports & Statistics", icon: <BarChartOutlined />, path: "/shared/records/statistics" },
  { key: "ward-6", label: "handover notes", icon: <BookOutlined />, path: "/shared/wards/hand-over-notes" },
  { key: "ward-7", label: "Duty Schedule", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
  { key: "records-6", label: "Message", icon: <WechatOutlined />, path: "/shared/chat" },
  { key: "record-9", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
  { key: "records-8", label: "Insurance Providers", icon: <BankOutlined />, path: "/shared/insurance-providers" },
];

export default recordsMenu;