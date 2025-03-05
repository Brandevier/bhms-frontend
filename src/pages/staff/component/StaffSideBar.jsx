import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  FileTextOutlined,
  BankOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileSyncOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  UserSwitchOutlined,
  ShopOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const StaffSideBar = () => {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed by default
  const { user } = useSelector((state) => state.auth);

  // Define department-specific menu items
  const departmentMenus = {
    "Ward": [
      { key: "ward-1", label: "Patients", icon: <UserOutlined />, path: "/ward/patients" },
      { key: "ward-2", label: "Admissions", icon: <FileTextOutlined />, path: "/ward/admissions" },
      { key: "records-3", label: "Time Table", icon: <CalendarOutlined />, path: "/shared/departments/store" },

    ],
    "Consultation": [
      // { key: "consult-1", label: "Discharge Patients", icon: <CalendarOutlined />, path: `/shared/consultation/${user.department.id}` },
      { key: "consult-2", label: "OPD Patients", icon: <UserOutlined />, path: "/shared/consultation/${user.department.id}" },
      { key: "records-5", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
      { key: "records-3", label: "Staff on Duty", icon: <CalendarOutlined />, path: "/shared/departments/store" },
      { key: "records-4", label: "Statistics", icon: <BarChartOutlined />, path: `/shared/departments/${user.department.id}/stats` },

    ],
    "Maternity Ward": [
      { key: "maternity-1", label: "Pregnancy Records", icon: <FileSearchOutlined />, path: "/maternity/records" },
      { key: "maternity-2", label: "Birth Reports", icon: <SolutionOutlined />, path: "/maternity/reports" },
    ],
    "Pharmacy": [
      { key: "pharmacy-1", label: "Medicines", icon: <MedicineBoxOutlined />, path: "/pharmacy/medicines" },
      { key: "pharmacy-2", label: "Prescriptions", icon: <FileTextOutlined />, path: "/pharmacy/prescriptions" },
    ],
    "Lab": [
      { key: "lab-1", label: "Test Requests", icon: <FileTextOutlined />, path: "/lab/requests" },
      { key: "lab-2", label: "Results", icon: <FileSearchOutlined />, path: "/lab/results" },
    ],
    "Records": [
      { key: "records-2", label: "Discharge Patients", icon: <UserSwitchOutlined />, path: "/shared/records/history" },
      { key: "records-3", label: "Transferred Requests", icon: <FileTextOutlined />, path: "/shared/records/history" },
      { key: "records-5", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
      { key: "records-6", label: "Time Table", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
      { key: "records-4", label: "Reports & Statistics", icon: <BarChartOutlined />, path: `/shared/records/${user.department.id}/statistics` },
    ],
    "OPD": [
      { key: "opd-1", label: "Check-ins", icon: <UserOutlined />, path: `/shared/opd/${user.department.id}`},
      { key: "opd-2", label: "Statistics", icon: <BarChartOutlined />, path: `/shared/departments/${user.department.id}/stats` },
      // { key: "opd-2", label: "Triage", icon: <AppstoreOutlined />, path: "/shared//opd/triage" },
    ],
    "Accounts": [
      { key: "accounts-1", label: "Billing", icon: <BankOutlined />, path: "/accounts/billing" },
      { key: "accounts-2", label: "Invoices", icon: <FileTextOutlined />, path: "/accounts/invoices" },
    ],
    "HR": [
      { key: "hr-1", label: "Staff Management", icon: <TeamOutlined />, path: "/hr/staff" },
      { key: "hr-2", label: "Payroll", icon: <FileTextOutlined />, path: "/hr/payroll" },
    ],
    "Store": [
      { key: "store-2", label: "Stock Items", icon: <AppstoreOutlined />, path: `/shared/store/${user.department.id}/stock/items` }, // Inventory Icon
      { key: "store-3", label: "Pending Request", icon: <FileSyncOutlined />, path: `/shared/store/${user.department.id}/pending-requests` }, // Syncing Icon for pending requests
      { key: "store-6", label: "Issued Items", icon: <FileDoneOutlined />, path: `/shared/store/${user.department.id}/issued-items` }, // Done/Completed Icon for issued items
      // { key: "store-4", label: "Out of Stock", icon: <ExclamationCircleOutlined />, path: "/store/supplies" }, // Alert Icon for out-of-stock items
      { key: "store-5", label: "Expired Items", icon: <StopOutlined />, path: `/shared/store/${user.department.id}/expired-items` }, // Stop Icon for expired items
    ],
  };

  // Get user department menu items or show a default message
  const userDepartment = user?.department?.departmentType || "Unknown";
  const departmentMenuItems = departmentMenus[userDepartment] || [];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onMouseEnter={() => setCollapsed(false)} // Expand on hover
      onMouseLeave={() => setCollapsed(true)}  // Collapse when mouse leaves
      trigger={null}
      style={{
        background: "white",
        borderRight: "1px solid #E5E7EB",
        boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      {/* Logo Section */}
      <div className="flex justify-center items-center py-6 border-b border-gray-200">
        <img
          src="/assets/logo.svg" // Replace with actual logo
          alt="BHMS"
          className={`transition-all duration-300 ${collapsed ? "w-10" : "w-28"}`}
        />
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <Menu mode="vertical" defaultSelectedKeys={["dashboard"]} style={{ background: "white", borderRight: "none" }}>
          {/* Dashboard (Always Present) */}
          <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#475569" }} />}>
            <Link to="/shared/departments" className="text-gray-800">Dashboard</Link>
          </Menu.Item>

          {/* Department-specific Menu Items */}
          {departmentMenuItems.length > 0 ? (
            departmentMenuItems.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path} className="text-gray-800">{item.label}</Link>
              </Menu.Item>
            ))
          ) : (
            <Menu.Item key="unknown" disabled>
              No department assigned
            </Menu.Item>
          )}
        </Menu>
      </div>
    </Sider>
  );
};

export default StaffSideBar;