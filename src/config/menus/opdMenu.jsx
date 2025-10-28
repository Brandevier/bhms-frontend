import {
  UserOutlined,
  BarChartOutlined,
  WechatOutlined,
  ShopOutlined,
  CalendarOutlined,
  UserSwitchOutlined,
  BookOutlined,
} from "@ant-design/icons";

const opdMenu = [
  { key: "opd-1", label: "Check-ins", icon: <UserOutlined />, path: "/shared/consultation/opd" },
  { key: "opd-2", label: "Statistics", icon: <BarChartOutlined />, path: "/shared/departments/opd/stats" },
  { key: "opd-3", label: "Message", icon: <WechatOutlined />, path: "/shared/chat" },
  { key: "opd-4", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
  { key: "ward-6", label: "handover notes", icon: <BookOutlined />, path: "/shared/wards/hand-over-notes" },
  { key: "ward-7", label: "Duty Schedule", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
  { key: "opd-6", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
];

export default opdMenu;