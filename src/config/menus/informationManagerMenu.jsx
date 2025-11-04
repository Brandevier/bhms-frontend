import {
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  EyeOutlined,
  CloudDownloadOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";

const informationManagerMenu = [
  // {
  //   key: "im-1",
  //   label: "Analytics Dashboard",
  //   icon: <DashboardOutlined />,
  //   path: "/information-manager/dashboard"
  // },
  {
    key: "im-2-1",
    label: "Patients Analysis", 
    icon: <LineChartOutlined />,
    path: "/shared/information-manager/visualization/patient-analysis" 
  },
  {
    key: "im-2-2",
    label: "Diagnosis Analysis", 
    icon: <PieChartOutlined />,
    path: "/shared/information-manager/diagnosis-analysis" 
  },
  {
    key: "im-2-3",
    label: "Beds Analytics", 
    icon: <EyeOutlined />,
    path: "/shared/information-manager/visualization/beds-analytics" 
  },
  {
    key: "im-2-4",
    label: "Patient Summary", 
    icon: <EyeOutlined />, 
    path: "/shared/information-manager/visualization/patient-summary" 
  },

  {
    key: "im-3-1",
    label: "Lab Analytics", 
    icon: <CloudDownloadOutlined />,
    path: "/shared/information-manager/lab/analytics" 
  },
  {
    key: "im-3-2",
    label: "Maternity Analytics", 
    icon: <BarChartOutlined />, 
    path: "/shared/information-manager/maternity/analytics" 
  },

];

export default informationManagerMenu;