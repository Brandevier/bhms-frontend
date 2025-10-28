// src/components/staff/layout/StaffSideBar.jsx
import React, { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  DashboardOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined 
} from '@ant-design/icons';
import { useStaffDepartmentSwitch } from "../../../redux/hooks/useStaffDepartmentSwitch";
import departmentMenus from "../../../config/departmentMenus";

const { Sider } = Layout;
const { SubMenu } = Menu;

const StaffSideBar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get user and department switch state
  const user = useSelector((state) => state.auth.user || state.auth.admin);
  const { currentDepartment } = useStaffDepartmentSwitch();

  // FIXED: Use department TYPE instead of name for menu lookup
  const userBaseDepartment = user?.department?.departmentType || "Unknown";
  const activeDepartment = currentDepartment?.type || userBaseDepartment;
  
  // Get menus for the active department type
  const menus = departmentMenus[activeDepartment] || [];

  console.log('Current Department Object:', currentDepartment);
  console.log('Active Department Type:', activeDepartment);
  console.log('Available Menus:', menus);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle behavior
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
      {/* Mobile Toggle Button */}
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
        width={220}
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
            src={`${isMobile ? "/assets/tonitel_.png" : "/assets/logo_2.png"}`}
            alt="BHMS"
            className={`transition-all duration-300 ${(isMobile ? !mobileOpen : collapsed) ? "w-10" : "w-28"}`}
          />
        </div>

        {/* Department Info */}
        {/* {currentDepartment && (
          <div className="px-4 py-2 text-center border-b border-gray-100 bg-blue-50">
            <span className="text-xs font-medium text-blue-600">
              {currentDepartment.name}
              {currentDepartment.access_type && (
                <span className="text-gray-500 ml-1">({currentDepartment.access_type})</span>
              )}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              Type: {activeDepartment}
            </div>
          </div>
        )} */}

        {/* Dynamic Menu */}
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{ background: "white", borderRight: "none" }}
          inlineCollapsed={isMobile ? !mobileOpen : collapsed}
          key={activeDepartment} // Force re-render when department changes
        >
          {/* Departments Link */}
          <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#475569" }} />}>
            <Link to="/shared/departments" className="text-gray-800">Departments</Link>
          </Menu.Item>

          {/* Department-specific menus */}
          {menus.map((item) =>
            item.children ? (
              <SubMenu 
                key={item.key} 
                icon={item.icon} 
                title={item.label}
              >
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>
                    <Link to={child.path} className="text-gray-800">{child.label}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.path} className="text-gray-800">{item.label}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
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