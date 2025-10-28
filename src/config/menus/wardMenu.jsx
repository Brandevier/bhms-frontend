import {
  UserOutlined,
  TeamOutlined,
  RestOutlined as BedOutlined,
  CalendarOutlined,
  FileTextOutlined,
  ExportOutlined,
  ImportOutlined,
  WechatOutlined,
  BookOutlined
} from "@ant-design/icons";

const wardMenu = [
  { key: "ward-1", label: "Ward Patients", icon: <UserOutlined />, path: "/shared/wards/patients" },
  { key: "ward-2", label: "Admissions", icon: <ImportOutlined />, path: "/shared/admissions/all" },
  { key: "ward-3", label: "Transfers", icon: <ExportOutlined />, path: "/shared/wards/transfers" },
  { key: "ward-4", label: "Bed Allocation", icon: <BedOutlined />, path: "/shared/wards/beds" },
  { key: "ward-6", label: "handover notes", icon: <BookOutlined />, path: "/shared/wards/hand-over-notes" },
  { key: "ward-7", label: "Duty Schedule", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
    { key: "lab-3", label: "Message", icon: <WechatOutlined />, path: "/shared/chat" },
  
];

export default wardMenu;
