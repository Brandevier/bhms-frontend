import React, { useState } from "react";
import { Layout, Menu, Badge } from "antd";
import { Link } from "react-router-dom"; // Import Link
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MessageOutlined,
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CiOutlined,
  CalendarOutlined
} from "@ant-design/icons";

const { Sider } = Layout;

const BhmsSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

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
        <Menu mode="vertical" defaultSelectedKeys={["1"]} style={{ background: "white", borderRight: "none" }}>
          <Menu.Item key="1" icon={<DashboardOutlined style={{ color: "#475569" }} />}>
            <Link to="/admin" className="text-gray-800">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined style={{ color: "#475569" }} />}>
            <Link to="/admin/departments" className="text-gray-800">Department</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined style={{ color: "#475569" }} />}>
            <Link to="/admin/staffs" className="text-gray-800">Staff Management</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<InboxOutlined style={{ color: "#475569" }} />}>
            <Link to="/sms-management" className="text-gray-800">SMS Management</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<MessageOutlined style={{ color: "#475569" }} />}>
            <Link to="/messages" className="text-gray-800">Messages</Link>
            <Badge count={3} className="ml-2" />
          </Menu.Item>
          <Menu.Item key="6" icon={<CiOutlined style={{ color: "#475569" }} />}>
            <Link to="/admin/claims" className="text-gray-800">Claims</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<InboxOutlined style={{ color: "#475569" }} />}>
            <Link to="/patient-report" className="text-gray-800">Patient Report</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<InboxOutlined style={{ color: "#475569" }} />}>
            <Link to="/inventory" className="text-gray-800">Inventory</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<CalendarOutlined style={{ color: "#475569" }} />}>
            <Link to="/admin/task" className="text-gray-800">My Calendar</Link>
          </Menu.Item>
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

export default BhmsSidebar;
