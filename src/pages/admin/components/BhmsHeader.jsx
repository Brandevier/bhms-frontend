import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Badge, Modal, Button, Menu, message } from "antd";
import { BellOutlined, DownOutlined, LogoutOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments } from "../../../redux/slice/chatSlice";
import { switchDepartment, resetDepartment } from "../../../redux/slice/departmentSwitchSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slice/authSlice";

const { Header } = Layout;

const BhmsHeader = () => {
  const { admin } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.departments);
  const { currentDepartment, toolbarName } = useSelector((state) => state.departmentSwitch);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSwitch = (dept) => {
    if (dept === "Admin") {
      dispatch(resetDepartment());
      navigate("/shared/departments");
    } else {
      // Pass both departmentType and department (name)
      localStorage.setItem('department_id',dept.id)
      dispatch(
        switchDepartment({
          department: dept.departmentType, // internal use
          toolbarName: dept.name,          // display in header
        })
      );
      navigate("/shared/departments");
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      okType: "danger",
      onOk() {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        if (dispatch && logout) {
          dispatch(logout());
        }

        message.success("Logged out successfully");
        navigate("/");
        window.location.reload();
      },
    });
  };

  const departmentMenu = (
    <Menu>
      <Menu.Item key="admin" onClick={() => handleSwitch("Admin")}>
        Admin
      </Menu.Item>
      {departments?.map((dept) => (
        <Menu.Item
          key={dept.id}
          onClick={() => handleSwitch(dept)}
        >
          {dept.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const userMenu = (
    <Menu style={{ width: "12rem" }} className="rounded-lg">
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        danger
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        backgroundColor: "white",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        padding: "0 24px",
        border: "1px solid #E5E7EB",
      }}
      className="flex justify-between items-center w-full"
    >
      {/* Hospital Name */}
      <h1 className="text-lg font-semibold text-gray-800">
        {admin?.institution?.name} —{" "}
        <span className="text-blue-600">{toolbarName}</span>
      </h1>

      {/* Icons & Profile */}
      <div className="flex items-center gap-4">
        {/* Department Switch Button */}
        <Dropdown overlay={departmentMenu} trigger={["click"]}>
          <Button className="flex items-center gap-2">
            Switch Department <DownOutlined />
          </Button>
        </Dropdown>

        <Badge count={3}>
          <BellOutlined
            style={{ color: "#475569" }}
            className="text-xl cursor-pointer hover:text-gray-500"
          />
        </Badge>
        <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100">
            <Avatar src="https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Administrator</p>
              <p className="text-xs text-gray-500">{admin?.username}</p>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default BhmsHeader;
