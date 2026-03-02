import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  HomeOutlined,
  SendOutlined,
} from "@ant-design/icons";

const consultationMenu = [
  // ==================== DASHBOARD ====================
  {
    key: "consult-dashboard",
    label: "Doctor Dashboard",
    icon: <DashboardOutlined />,
    path: "/shared/consultation/doctor-dashboard"
  },

  // ==================== PATIENT QUEUE ====================
  {
    key: "consult-queue", 
    label: "Patient Queue",
    icon: <UserOutlined />,
    children: [
      { key: "consult-1", label: "All Patients", path: "/shared/consultation/opd" },
      { key: "consult-queue-1", label: "Waiting List", path: "/shared/consultation/waiting" },
      { key: "consult-queue-2", label: "In Progress", path: "/shared/consultation/in-progress" },
      { key: "consult-queue-3", label: "Completed Today", path: "/shared/consultation/completed" },
    ]
  },

  // ==================== CLINICAL ====================
  {
    key: "consult-clinical",
    label: "Clinical Records",
    icon: <FileTextOutlined />,
    children: [
      { key: "consult-clinical-1", label: "Patient Diagnosis", path: "/shared/consultation/diagnosis" },
      { key: "consult-clinical-2", label: "Doctor's Notes", path: "/shared/consultation/notes" },
    ]
  },

  // ==================== PHARMACY ====================
  {
    key: "consult-pharmacy",
    label: "Pharmacy",
    icon: <MedicineBoxOutlined />,
    path: "/shared/departments/pharmacy"
  },

  // ==================== LAB ====================
  {
    key: "consult-lab",
    label: "Lab Tests",
    icon: <ExperimentOutlined />,
    path: "/shared/lab"
  },

  // ==================== ADMISSIONS ====================
  {
    key: "consult-admission",
    label: "Admissions",
    icon: <HomeOutlined />,
    path: "/shared/wards"
  },

  // ==================== COMMUNICATION ====================
  {
    key: "consult-communication",
    label: "Communication",
    icon: <SendOutlined />,
    path: "/shared/chat"
  },
];

export default consultationMenu;
