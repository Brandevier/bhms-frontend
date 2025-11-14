import {
  UserOutlined,
  ShopOutlined,
  WechatOutlined,
  UsergroupAddOutlined,
  BarChartOutlined,
  UserSwitchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const consultationMenu = [
  { 
    key: "consult-2", 
    label: "OPD Patients", 
    icon: <UserOutlined />, 
    path: "/shared/consultation/opd" 
  },
  { 
    key: "consult-3", 
    label: "Stores", 
    icon: <ShopOutlined />, 
    path: "/shared/departments/store" 
  },
  { 
    key: "consult-4", 
    label: "Message", 
    icon: <WechatOutlined />, 
    path: "/shared/chat" 
  },
  // { 
  //   key: "consult-7", 
  //   label: "Admissions", 
  //   icon: <UsergroupAddOutlined />, 
  //   path: "/shared/admissions/all" 
  // },
  // { 
  //   key: "consult-6", 
  //   label: "Statistics", 
  //   icon: <BarChartOutlined />, 
  //   path: "/shared/departments/consultation/stats" 
  // },
  // { 
  //   key: "consult-9", 
  //   label: "Attendance", 
  //   icon: <UserSwitchOutlined />, 
  //   path: "/shared/attendance" 
  // },
  // { 
  //   key: "opd-5", 
  //   label: "Time Table", 
  //   icon: <CalendarOutlined />, 
  //   path: "/shared/departments/time-table" 
  // },
];

export default consultationMenu;