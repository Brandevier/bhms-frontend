import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom"; 
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  SolutionOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const StaffSideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Define department-specific menu items
  const departmentMenus = {
    "Ward": [
      { key: "ward-1", label: "Patients", icon: <UserOutlined />, path: "/ward/patients" },
      { key: "ward-2", label: "Admissions", icon: <FileTextOutlined />, path: "/ward/admissions" },
    ],
    "Consultation": [
      { key: "consult-1", label: "Appointments", icon: <CalendarOutlined />, path: "/consultation/appointments" },
      { key: "consult-2", label: "Patients", icon: <UserOutlined />, path: "/consultation/patients" },
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
      { key: "records-1", label: "Patient Records", icon: <FileSearchOutlined />, path: "/records/patients" },
      { key: "records-2", label: "Medical History", icon: <FileTextOutlined />, path: "/records/history" },
    ],
    "OPD": [
      { key: "opd-1", label: "Check-ins", icon: <UserOutlined />, path: "/opd/checkins" },
      { key: "opd-2", label: "Triage", icon: <AppstoreOutlined />, path: "/opd/triage" },
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
      { key: "store-1", label: "Inventory", icon: <ShoppingCartOutlined />, path: "/store/inventory" },
      { key: "store-2", label: "Supplies", icon: <AppstoreOutlined />, path: "/store/supplies" },
    ],
  };

  // Get user department menu items or show a default message
  const userDepartment = user?.department?.name || "Unknown";
  const departmentMenuItems = departmentMenus[userDepartment] || [];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
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

      {/* Toggle Button at Bottom */}
      <div
        style={{ background: "white", borderTop: "1px solid #E5E7EB" }}
        className="flex justify-center items-center py-4 cursor-pointer hover:bg-gray-100"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MenuUnfoldOutlined className="text-gray-800 text-xl" /> : <MenuFoldOutlined className="text-gray-800 text-xl" />}
      </div>
    </Sider>
  );
};

export default StaffSideBar;
