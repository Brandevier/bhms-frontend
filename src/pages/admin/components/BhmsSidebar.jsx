import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MessageOutlined,
  InboxOutlined,
  FileTextOutlined,
  CalendarOutlined,
  WechatOutlined,
  DollarOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  ScheduleOutlined
} from "@ant-design/icons";

const { Sider } = Layout;
const { SubMenu } = Menu;

const BhmsSidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)",
        height: "100vh",
        transition: "width 0.3s ease-in-out", // Smooth transition effect
        overflow: "hidden",
      }}
    >
      {/* Logo Section */}
      <div className="flex justify-center items-center py-4 border-b border-gray-100">
        <img
          src="/assets/logo.svg"
          alt="Hospital Logo"
          className={`transition-all duration-200 ${collapsed ? "w-8" : "w-32"}`}
        />
      </div>

      {/* Main Navigation */}
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        style={{ borderRight: 0 }}
      >
        {/* Dashboard */}
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>

        {/* Patient Management */}
        <SubMenu
          key="patientManagement"
          icon={<UserOutlined />}
          title="Patient Management"
        >
          <Menu.Item key="patientRecords">
            <Link to="/admin/patient-report">Patient Records</Link>
          </Menu.Item>
          <Menu.Item key="appointments">
            <Link to="/admin/appointments">Appointments</Link>
          </Menu.Item>
          <Menu.Item key="admissions">
            <Link to="/admin/admissions">Admissions</Link>
          </Menu.Item>
        </SubMenu>

        {/* Medical Services */}
        <SubMenu
          key="medicalServices"
          icon={<MedicineBoxOutlined />}
          title="Medical Services"
        >
          <Menu.Item key="departments">
            <Link to="/shared/departments">Departments</Link>
          </Menu.Item>
          <Menu.Item key="services">
            <Link to="/admin/service">Services</Link>
          </Menu.Item>
          <Menu.Item key="wards">
            <Link to="/admin/wards">Wards & Beds</Link>
          </Menu.Item>
        </SubMenu>

        {/* Billing & Finance */}
        <SubMenu
          key="billing"
          icon={<DollarOutlined />}
          title="Billing & Finance"
        >
          <Menu.Item key="invoices">
            <Link to="/shared/departments/accounts">Invoices</Link>
          </Menu.Item>
          <Menu.Item key="insurance">
            <Link to="/admin/insurance">Insurance Claims</Link>
          </Menu.Item>
          <Menu.Item key="payments">
            <Link to="/admin/payments">Payment Records</Link>
          </Menu.Item>
        </SubMenu>

        {/* Staff Management */}
        <SubMenu
          key="staff"
          icon={<TeamOutlined />}
          title="Staff Management"
        >
          <Menu.Item key="staffDirectory">
            <Link to="/admin/staffs">Staff Directory</Link>
          </Menu.Item>
          <Menu.Item key="attendance">
            <Link to="/admin/attendance">Attendance</Link>
          </Menu.Item>
          <Menu.Item key="schedules">
            <Link to="/admin/schedules">Schedules</Link>
          </Menu.Item>
        </SubMenu>

        {/* Communication */}
        <SubMenu
          key="communication"
          icon={<MessageOutlined />}
          title="Communication"
        >
          <Menu.Item key="messaging">
            <Link to="/shared/chat">Messaging</Link>
          </Menu.Item>
          <Menu.Item key="chat">
            <Link to="/shared/communication/call-chat">Call Chat</Link>
          </Menu.Item>
          <Menu.Item key="notifications">
            <Link to="/admin/notifications">Notifications</Link>
          </Menu.Item>
        </SubMenu>

        {/* Reports */}
        <SubMenu
          key="reports"
          icon={<FileTextOutlined />}
          title="Reports"
        >
          <Menu.Item key="financialReports">
            <Link to="/admin/reports/financial">Financial</Link>
          </Menu.Item>
          <Menu.Item key="medicalReports">
            <Link to="/admin/reports/medical">Medical</Link>
          </Menu.Item>
          <Menu.Item key="operationalReports">
            <Link to="/admin/reports/operational">Operational</Link>
          </Menu.Item>
        </SubMenu>

        {/* Calendar */}
        <Menu.Item key="calendar" icon={<CalendarOutlined />}>
          <Link to="/admin/calendar">Calendar</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default BhmsSidebar;