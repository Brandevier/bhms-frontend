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
  {
    key: "im-1",
    label: "Analytics Dashboard",
    icon: <DashboardOutlined />,
    path: "/information-manager/dashboard"
  },
  {
    key: "im-2",
    label: "Data Visualization",
    icon: <BarChartOutlined />,
    children: [
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
        label: "Status - inPatient & Out-Patient", 
        icon: <EyeOutlined />, 
        path: "/shared/information-manager/visualization/patient-summary" 
      },
    ]
  },
  {
    key: "im-3",
    label: "Data Management",
    icon: <DatabaseOutlined />,
    children: [
      { 
        key: "im-3-1", 
        label: "Data Sources", 
        icon: <CloudDownloadOutlined />,
        path: "/information-manager/data/sources" 
      },
      { 
        key: "im-3-2", 
        label: "Data Cleaning", 
        icon: <FilterOutlined />,
        path: "/information-manager/data/cleaning" 
      },
      { 
        key: "im-3-3", 
        label: "Data Warehousing", 
        icon: <DatabaseOutlined />,
        path: "/information-manager/data/warehouse" 
      },
    ]
  },
  {
    key: "im-4",
    label: "Business Intelligence",
    icon: <FileTextOutlined />,
    children: [
      { 
        key: "im-4-1", 
        label: "KPI Monitoring", 
        icon: <BarChartOutlined />,
        path: "/information-manager/bi/kpi" 
      },
      { 
        key: "im-4-2", 
        label: "Trend Analysis", 
        icon: <LineChartOutlined />,
        path: "/information-manager/bi/trends" 
      },
      { 
        key: "im-4-3", 
        label: "Predictive Analytics", 
        icon: <PieChartOutlined />,
        path: "/information-manager/bi/predictive" 
      },
    ]
  },
  {
    key: "im-5",
    label: "Department Analytics",
    icon: <TeamOutlined />,
    children: [
      { 
        key: "im-5-1", 
        label: "Clinical Performance", 
        icon: <BarChartOutlined />,
        path: "/information-manager/analytics/clinical" 
      },
      { 
        key: "im-5-2", 
        label: "Financial Analytics", 
        icon: <PieChartOutlined />,
        path: "/information-manager/analytics/financial" 
      },
      { 
        key: "im-5-3", 
        label: "Operational Efficiency", 
        icon: <LineChartOutlined />,
        path: "/information-manager/analytics/operational" 
      },
    ]
  },
  {
    key: "im-6",
    label: "Report Generation",
    icon: <FileTextOutlined />,
    children: [
      { 
        key: "im-6-1", 
        label: "Custom Reports", 
        icon: <FileTextOutlined />,
        path: "/information-manager/reports/custom" 
      },
      { 
        key: "im-6-2", 
        label: "Scheduled Reports", 
        icon: <CloudDownloadOutlined />,
        path: "/information-manager/reports/scheduled" 
      },
      { 
        key: "im-6-3", 
        label: "Export Tools", 
        icon: <CloudDownloadOutlined />,
        path: "/information-manager/reports/export" 
      },
    ]
  },
  {
    key: "im-7",
    label: "Data Governance",
    icon: <SafetyCertificateOutlined />,
    children: [
      { 
        key: "im-7-1", 
        label: "Data Quality", 
        icon: <SafetyCertificateOutlined />,
        path: "/information-manager/governance/quality" 
      },
      { 
        key: "im-7-2", 
        label: "Compliance Reporting", 
        icon: <FileTextOutlined />,
        path: "/information-manager/governance/compliance" 
      },
      { 
        key: "im-7-3", 
        label: "Audit Trails", 
        icon: <EyeOutlined />,
        path: "/information-manager/governance/audit" 
      },
    ]
  },
  {
    key: "im-8",
    label: "System Settings",
    icon: <SettingOutlined />,
    path: "/information-manager/settings"
  },
  { 
    key: "im-9", 
    label: "Attendance", 
    icon: <UserSwitchOutlined />, 
    path: "/shared/attendance" 
  },
];

export default informationManagerMenu;