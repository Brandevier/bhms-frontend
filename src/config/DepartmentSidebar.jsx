// src/config/DepartmentSidebar.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import departmentMenus from "./departmentMenus";
import { useSelector } from "react-redux";

const { Sider } = Layout;
const { SubMenu } = Menu;

const DepartmentSidebar = ({ collapsed, setCollapsed }) => {
  const { currentDepartment } = useSelector((state) => state.departmentSwitch);
  const menus = departmentMenus[currentDepartment] || [];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={220}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)",
        height: "100vh",
        transition: "width 0.3s ease-in-out",
        // position: "fixed",
      }}
    >
      {/* Logo */}
      <div className="flex justify-center items-center py-4 border-b border-gray-100">
        <img
          src={`${collapsed ? "/assets/tonitel_.png" : "/assets/logo_2.png"}`}
          alt="Hospital Logo"
          className={`transition-all duration-200 ${collapsed ? "w-8" : "w-32"}`}
        />
      </div>

      {/* Dynamic menu */}
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        inlineCollapsed={collapsed}
      >
        {menus.map((item) =>
          item.children ? (
            <SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.children.map((child) => (
                <Menu.Item key={child.key}>
                  <Link to={child.path}>{child.label}</Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          )
        )}
      </Menu>
    </Sider>
  );
};

export default DepartmentSidebar;
