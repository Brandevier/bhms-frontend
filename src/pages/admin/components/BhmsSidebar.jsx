import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom"; // Import Link
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MessageOutlined,
  InboxOutlined,
  CiOutlined,
  CalendarOutlined,
  WechatOutlined,
  BilibiliOutlined, // Added chat icon
} from "@ant-design/icons";

const { Sider } = Layout;

const BhmsSidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Initially collapsed

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      onMouseEnter={() => setCollapsed(false)} // Expand when hovered
      onMouseLeave={() => setCollapsed(true)} // Collapse when mouse leaves
      style={{
        background: "white",
        borderRight: "1px solid #E5E7EB",
        boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)",
        height: "100vh",
        transition: "width 0.3s ease-in-out", // Smooth transition effect
        overflow: "hidden",
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
      <Menu mode="vertical" defaultSelectedKeys={["1"]} style={{ background: "white", borderRight: "none" }}>
        <Menu.Item key="1" icon={<DashboardOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin" className="text-gray-800">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<AppstoreOutlined style={{ color: "#475569" }} />}>
          <Link to="/shared/departments" className="text-gray-800">Department</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<TeamOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin/staffs" className="text-gray-800">Staff Management</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<InboxOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin/sms-management" className="text-gray-800">SMS Management</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<MessageOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin/service" className="text-gray-800">Service</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<CiOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin/claims" className="text-gray-800">Claims</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<InboxOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin/patient-report" className="text-gray-800">Patient Report</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<WechatOutlined style={{ color: "#475569" }} />}>
          <Link to="/shared/chat" className="text-gray-800">Chat</Link> {/* 🔹 Added Chat Link */}
        </Menu.Item>

        <Menu.Item key="8" icon={<BilibiliOutlined style={{ color: "#475569" }} />}>
          <Link to="/shared/departments/accounts" className="text-gray-800">Bills</Link> {/* 🔹 Added Chat Link */}
        </Menu.Item>
        <Menu.Item key="9" icon={<CalendarOutlined style={{ color: "#475569" }} />}>
          <Link to="/admin/task" className="text-gray-800">My Calendar</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default BhmsSidebar;
