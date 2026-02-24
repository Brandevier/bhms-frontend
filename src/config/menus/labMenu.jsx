import {
  ExperimentOutlined,
  FormOutlined,
  WechatOutlined,
  ShopOutlined,
  CalendarOutlined,
  UserSwitchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const labMenu = [
  {
    key: "lab-1",
    label: "Test Results",
    icon: <ExperimentOutlined />,
    children: [
      { key: "lab-2-1", label: "Pending Test", path: "/shared/lab/tests/pending" },
      { key: "lab-2-2", label: "Lab Ranges", path: "/shared/lab/ranges" },
      { key: "lab-2-3", label: "Statistics", path: "/shared/lab/statistics" },
      { key: "lab-2-4", label: "Recent Tests", path: "/shared/lab/tests/recent" },
    ]
  },
  {
    key: "lab-2",
    label: "Test Templates",
    icon: <FormOutlined />,
    children: [
      { key: "lab-1-1", label: "Create Template", path: "/shared/lab/templates/create" },
      { key: "lab-1-2", label: "Manage Templates", path: "/shared/lab/templates/manage" },
      { key: "lab-1-3", label: "Template Categories", path: "/lab/templates/categories" },
    ]
  },
  { key: "lab-3", label: "Message", icon: <WechatOutlined />, path: "/shared/chat" },
  { key: "lab-dept-call", label: "Department Video Call", icon: <VideoCameraOutlined />, path: "/shared/communication/department-call" },
  { key: "lab-4", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
  { key: "lab-5", label: "Time Table", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
  { key: "lab-6", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
];

export default labMenu;
