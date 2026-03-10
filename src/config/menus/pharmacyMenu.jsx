import {
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  WechatOutlined,
  UserSwitchOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";

const pharmacyMenu = [
  {
    key: "pharmacy-1",
    label: "Prescriptions",
    icon: <FileTextOutlined />,
    children: [
      { key: "pharmacy-1-1", label: "Pending Prescriptions", path: "/shared/departments/pharmacy/pending" },
      { key: "pharmacy-1-2", label: "Dispensed History", path: "/shared/departments/pharmacy/dispensed" },
      { key: "pharmacy-1-3", label: "Unfulfilled Prescription", path: "/shared/departments/pharmacy/prescriptions/rejected" },
    ]
  },
  // {
  //   key: "pharmacy-3",
  //   label: "Patient Management",
  //   icon: <TeamOutlined />,
  //   children: [
  //     { key: "pharmacy-3-1", label: "Active Patients", path: "/shared/pharmacy/patients/active" },
  //     { key: "pharmacy-3-3", label: "Patient Counseling", path: "/shared/departments/pharmacy/counsel" },
  //   ]
  // },
  {
    key: "pharmacy-4",
    label: "Reports & Analytics",
    icon: <BarChartOutlined />,
    children: [
      { key: "pharmacy-4-2", label: "Prescriber Patterns", path: "/shared/departments/pharmacy/prescriptions/patterns" },
      { key: "pharmacy-4-3", label: "Clinical Interventions", path: "/shared/pharmacy/reports/interventions" },
    ]
  },
  { key: "pharmacy-5", label: "Communication", icon: <WechatOutlined />, path: "/shared/chat" },
  { key: "pharmacy-dept-call", label: "Department Video Call", icon: <VideoCameraOutlined />, path: "/shared/communication/department-call" },
  { key: "pharm-9", label: "Attendance", icon: <UserSwitchOutlined />, path: "/shared/attendance" },
    { key: "ward-7", label: "Duty Schedule", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },

  {
    key: "pharmacy-6",
    label: "Regulatory",
    icon: <SafetyCertificateOutlined />,
    children: [
      { key: "pharmacy-6-1", label: "Controlled Substances", path: "/shared/pharmacy/controlled-substances" },
      { key: "pharmacy-6-2", label: "Audit Trail", path: "/shared/pharmacy/audit" },
    ]
  },
];

export default pharmacyMenu;
