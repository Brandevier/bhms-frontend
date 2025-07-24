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
  SafetyCertificateOutlined,
  StopOutlined,
  UserSwitchOutlined,
  ShopOutlined,
  BarChartOutlined,
  UserAddOutlined,
  ProfileOutlined,
  WechatOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined,
  // New icons for Surgery Department
  ScheduleOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
  ControlOutlined,
  SafetyOutlined,
  EditOutlined,
  MessageOutlined,
  ToolOutlined,
  NodeIndexOutlined,
  SyncOutlined,
  FormOutlined,
  SettingOutlined
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
      {
        key: "pharmacy-1",
        label: "Prescriptions",
        icon: <FileTextOutlined />,
        children: [
          {
            key: "pharmacy-1-1",
            label: "Pending Prescriptions",
            path: "/shared/departments/pharmacy/pending"
          },
          {
            key: "pharmacy-1-2",
            label: "Dispensed History",
            path: "/shared/departments/pharmacy/dispensed"
          },
          {
            key: "pharmacy-1-3",
            label: "Rejected Prescriptions",
            path: "/shared/departments/pharmacy/prescriptions/rejected"
          }
        ]
      },
    
      {
        key: "pharmacy-3",
        label: "Patient Management",
        icon: <TeamOutlined />,
        children: [
          {
            key: "pharmacy-3-1",
            label: "Active Patients",
            path: "/shared/pharmacy/patients/active"
          },
          {
            key: "pharmacy-3-3",
            label: "Patient Counseling",
            path: "/shared/departments/pharmacy/counsel"
          }
        ]
      },
      {
        key: "pharmacy-4",
        label: "Reports & Analytics",
        icon: <BarChartOutlined />,
        children: [
        
          {
            key: "pharmacy-4-2",
            label: "Prescriber Patterns",
            path: "/shared/departments/pharmacy/prescriptions/patterns"
          },
          {
            key: "pharmacy-4-3",
            label: "Clinical Interventions",
            path: "/shared/pharmacy/reports/interventions"
          }
        ]
      },
      {
        key: "pharmacy-5",
        label: "Communication",
        icon: <WechatOutlined />,
        path: `/shared/chat`
      },
      {
        key: "pharmacy-6",
        label: "Regulatory",
        icon: <SafetyCertificateOutlined />,
        children: [
          {
            key: "pharmacy-6-1",
            label: "Controlled Substances",
            path: "/shared/pharmacy/controlled-substances"
          },
          {
            key: "pharmacy-6-2",
            label: "Audit Trail",
            path: "/shared/pharmacy/audit"
          }
        ]
      }
    ],
    "Lab": [
      {
        key: "lab-1",
        label: "Test Results",
        icon: <ExperimentOutlined />,
        children: [
          {
            key: "lab-2-1",
            label: "Pending Test",
            path: "/shared/lab/tests/pending"
          },
          {
            key: "lab-2-2",
            label: "Lab Ranges",
            path: "/shared/lab/ranges"
          },
          {
            key: "lab-2-3",
            label: "Statistics",
            path: "/shared/lab/statistics"
          }
        ]
      },
      {
        key: "lab-2",
        label: "Test Templates",
        icon: <FormOutlined />,
        children: [
          {
            key: "lab-1-1",
            label: "Create Template",
            path: "/shared/lab/templates/create"
          },
          {
            key: "lab-1-2",
            label: "Manage Templates",
            path: "/shared/lab/templates/manage"
          },
          {
            key: "lab-1-3",
            label: "Template Categories",
            path: "/lab/templates/categories"
          }
        ]
      },

      {
        key: "lab-3",
        label: "Message",
        icon: <WechatOutlined />,
        path: `/shared/chat`
      },
      {
        key: "lab-4",
        label: "Stores",
        icon: <ShopOutlined />,
        path: "/shared/departments/store"
      },
      {
        key: "lab-5",
        label: "Time Table",
        icon: <CalendarOutlined />,
        path: "/shared/departments/time-table"
      },


    ],
    "Records": [
      { key: "records-2", label: "All Patients", icon: <UserSwitchOutlined />, path: "/shared/records" },
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
    "Claims": [
      {
        key: "claims-dashboard",
        label: "Claims Dashboard",
        icon: <DashboardOutlined />,  // Or <PieChartOutlined /> for analytics
        path: `/shared/claims/${user.department.id}/dashboard`
      },
      {
        key: "claims-1",
        label: "Submitted Claims",
        icon: <FileDoneOutlined />,
        path: `/shared/claims/${user.department.id}/submitted`
      },
      {
        key: "claims-2",
        label: "Claim Items",
        icon: <AppstoreOutlined />,
        path: `/shared/claims/${user.department.id}/items`
      },
      {
        key: "claims-3",
        label: "Medications",
        icon: <MedicineBoxOutlined />,
        path: `/shared/claims/${user.department.id}/medications`
      },
      {
        key: "claims-4",
        label: "ICD-10 Codes",
        icon: <ProfileOutlined />,
        path: `/shared/claims/${user.department.id}/diagnosis`
      },
      {
        key: "claims-5",
        label: "GDRG Mappings",
        icon: <NodeIndexOutlined />,
        path: `/shared/claims/${user.department.id}/mappings`
      },
      {
        key: "claims-6",
        label: "Lab Tests",
        icon: <ExperimentOutlined />,
        path: `/shared/claims/${user.department.id}/lab-tests`
      },
      {
        key: "claims-7",
        label: "Procedures",
        icon: <ToolOutlined />,
        path: `/shared/claims/${user.department.id}/procedures`
      },
      {
        key: "claims-8",
        label: "NHIA Sync",
        icon: <SyncOutlined />,
        path: `/shared/claims/${user.department.id}/nhia-sync`
      }
    ],

    "Surgery": [
      {
        key: "surgery-1",
        label: "OR Scheduling",
        icon: <ScheduleOutlined />,
        path: "/shared/surgery/scheduling"
      },
      {
        key: "surgery-2",
        label: "Room Status",
        icon: <DashboardOutlined />,
        path: "/shared/surgery/room-status"
      },
      {
        key: "surgery-3",
        label: "Resource Allocation",
        icon: <DeploymentUnitOutlined />,
        path: "/shared/surgery/resource-allocation"
      },
      {
        key: "surgery-4",
        label: "Pre-Op Management",
        icon: <FileDoneOutlined />,
        path: "/shared/surgery/pre-op"
      },
      {
        key: "surgery-5",
        label: "Intra-Op Documentation",
        icon: <EditOutlined />,
        path: "/shared/surgery/intra-op"
      },
      {
        key: "surgery-6",
        label: "Post-Op Tracking",
        icon: <FileSyncOutlined />,
        path: "/shared/surgery/post-op"
      },
      {
        key: "surgery-7",
        label: "Surgical Team",
        icon: <TeamOutlined />,
        path: "/surgery/team"
      },
      {
        key: "surgery-8",
        label: "Instrument Tracking",
        icon: <ControlOutlined />,
        path: "/surgery/instruments"
      },
      {
        key: "surgery-9",
        label: "Safety Systems",
        icon: <SafetyOutlined />,
        path: "/surgery/safety"
      },
      {
        key: "surgery-10",
        label: "Surgical Reports",
        icon: <BarChartOutlined />,
        path: "/surgery/reports"
      },
      {
        key: "surgery-11",
        label: "Message",
        icon: <MessageOutlined />,
        path: `/shared/surgery/chat`
      },
      {
        key: "surgery-12",
        label: "Stores",
        icon: <ShopOutlined />,
        path: "/shared/departments/store"
      },
    ]
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
            src={`${isMobile ? "/assets/tonitel_.png" : "/assets/logo_2.png"}`}
            alt="BHMS"
            className={`transition-all duration-300 ${(isMobile ? !mobileOpen : collapsed) ? "w-10" : "w-28"}`}
          />
        </div>

        {/* Menu Items */}
        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            defaultOpenKeys={departmentMenuItems.filter(item => item.children).map(item => item.key)}
            style={{ background: "white", borderRight: "none" }}
          >
            <Menu.Item key="dashboard" icon={<DashboardOutlined style={{ color: "#475569" }} />}>
              <Link to="/shared/departments" className="text-gray-800">Dashboard</Link>
            </Menu.Item>

            {departmentMenuItems.length > 0 ? (
              departmentMenuItems.map((item) => {
                if (item.children) {
                  return (
                    <Menu.SubMenu
                      key={item.key}
                      icon={item.icon}
                      title={item.label}
                    >
                      {item.children.map(child => (
                        <Menu.Item key={child.key}>
                          <Link to={child.path} className="text-gray-800">{child.label}</Link>
                        </Menu.Item>
                      ))}
                    </Menu.SubMenu>
                  );
                }
                return (
                  <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.path} className="text-gray-800">{item.label}</Link>
                  </Menu.Item>
                );
              })
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