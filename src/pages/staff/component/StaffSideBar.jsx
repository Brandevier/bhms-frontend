import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
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
  BarChartOutlined,
  UserAddOutlined,
  ProfileOutlined,
  WechatOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const StaffSideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define department-specific menu items
  const departmentMenus = {
    "Ward": [
      { key: "ward-1", label: "Patients", icon: <UserOutlined />, path: "/ward/patients" },
      { key: "ward-2", label: "Admissions", icon: <FileTextOutlined />, path: "/ward/admissions" },
      { key: "records-3", label: "Time Table", icon: <CalendarOutlined />, path: "/shared/departments/store" },
    ],
    "Consultation": [
      { key: "consult-2", label: "OPD Patients", icon: <UserOutlined />, path: `/shared/consultation/${user.department.id}` },
      { key: "consult-3", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
      { key: "consult-4", label: "Message", icon: <WechatOutlined />, path: `/shared/chat` },
      { key: "consult-7", label: "Admissions", icon: <UsergroupAddOutlined />, path: `/shared/admissions/all` },
      { key: "consult-5", label: "Staff on Duty", icon: <CalendarOutlined />, path: `/shared/departments/${user.department.id}/shift-schedule` },
      { key: "consult-6", label: "Statistics", icon: <BarChartOutlined />, path: `/shared/departments/${user.department.id}/stats` },
    ],
    "Antenatal & Postnatal Ward": [
      { key: "ANC-0", label: "Maternity Registration", icon: <UserAddOutlined />, path: `/shared/maternity/registration/${user.department.id}` },
      { key: "ANC-1", label: "Pregnancy Records", icon: <FileTextOutlined />, path: "/maternity/pregnancy-records" },
      { key: "ANC-2", label: "Birth Reports", icon: <ProfileOutlined />, path: "/maternity/birth-reports" },
      { key: "ANC-3", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
    ],
    "Pharmacy": [
      { key: "pharmacy-1", label: "Medicines", icon: <MedicineBoxOutlined />, path: "/pharmacy/medicines" },
      { key: "pharmacy-2", label: "Prescriptions", icon: <FileTextOutlined />, path: "/pharmacy/prescriptions" },
      { key: "pharmacy-3", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
      { key: "pharmacy-4", label: "Message", icon: <WechatOutlined />, path: `/shared/chat` },
    ],
    "Lab": [
      { key: "lab-3", label: "Message", icon: <WechatOutlined />, path: `/shared/chat` },
      { key: "lab-4", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
      { key: "lab-5", label: "Time Table", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },

    ],
    "Records": [
      { key: "records-2", label: "Discharge Patients", icon: <UserSwitchOutlined />, path: "/shared/records/history" },
      { key: "records-4", label: "Stores", icon: <ShopOutlined />, path: "/shared/departments/store" },
      { key: "records-5", label: "Time Table", icon: <CalendarOutlined />, path: "/shared/departments/time-table" },
      { key: "records-6", label: "Message", icon: <WechatOutlined />, path: `/shared/chat` },
      { key: "records-7", label: "Reports & Statistics", icon: <BarChartOutlined />, path: `/shared/records/${user.department.id}/statistics` },
    ],
    "OPD": [
      { key: "opd-1", label: "Check-ins", icon: <UserOutlined />, path: `/shared/opd/${user.department.id}` },
      { key: "opd-2", label: "Statistics", icon: <BarChartOutlined />, path: `/shared/departments/${user.department.id}/stats` },
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
      { key: "store-2", label: "Stock Items", icon: <AppstoreOutlined />, path: `/shared/store/${user.department.id}/stock/items` },
      { key: "store-3", label: "Pending Request", icon: <FileSyncOutlined />, path: `/shared/store/${user.department.id}/pending-requests` },
      { key: "store-6", label: "Issued Items", icon: <FileDoneOutlined />, path: `/shared/store/${user.department.id}/issued-items` },
      { key: "store-5", label: "Expired Items", icon: <StopOutlined />, path: `/shared/store/${user.department.id}/expired-items` },
    ],
  };

  const userDepartment = user?.department?.departmentType || "Unknown";
  const departmentMenuItems = departmentMenus[userDepartment] || [];

  // Toggle behavior - different for mobile and desktop
  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && mobileOpen && !event.target.closest('.ant-layout-sider')) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, mobileOpen]);

  return (
    <>
      {/* Mobile Toggle Button (fixed position) */}
      {isMobile && (
        <Button
          type="text"
          icon={mobileOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleToggle}
          style={{
            position: 'fixed',
            zIndex: 1001,
            left: 16,
            top: 16,
          }}
        />
      )}

      <Sider
        collapsible
        collapsed={isMobile ? !mobileOpen : collapsed}
        onMouseEnter={!isMobile ? () => setCollapsed(false) : undefined}
        onMouseLeave={!isMobile ? () => setCollapsed(true) : undefined}
        trigger={null}
        style={{
          background: "white",
          borderRight: "1px solid #E5E7EB",
          boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)",
          height: "100vh",
          position: isMobile ? 'fixed' : 'relative',
          zIndex: 1000,
          left: isMobile && !mobileOpen ? '-100%' : 0,
          transition: 'all 0.2s',
        }}
        className="mobile-sidebar"
      >
        {/* Logo Section */}
        <div className="flex justify-center items-center py-6 border-b border-gray-200">
          <img
            src="/assets/logo.svg"
            alt="BHMS"
            className={`transition-all duration-300 ${(isMobile ? !mobileOpen : collapsed) ? "w-10" : "w-28"}`}
          />
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <Menu mode="vertical" defaultSelectedKeys={["dashboard"]} style={{ background: "white", borderRight: "none" }}>
            <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#475569" }} />}>
              <Link to="/shared/departments" className="text-gray-800">Dashboard</Link>
            </Menu.Item>

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

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default StaffSideBar;