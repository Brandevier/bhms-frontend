// src/components/staff/layout/HeaderComponents/UserDropdown.js
import React from 'react';
import { Dropdown, Avatar, Modal, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/slice/authSlice';

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentDepartment } = useSelector((state) => state.staffDepartment);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Yes, Logout",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(logout());
        message.success("You have been logged out");
        navigate("/staff/login");
      },
    });
  };

  const userMenu = (
    <div style={{ width: "12rem" }} className="p-4 bg-white shadow-lg rounded-lg">
      <p className="text-gray-500 text-sm mb-1">
        {user.firstName} {user.middleName || ""} {user.lastName}
      </p>
      <hr className="my-2" />
      <button
        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
        onClick={() => navigate("/shared/profile")}
      >
        Profile
      </button>
      <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">
        Settings
      </button>
      <button
        className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );

  return (
    <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
      <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50">
        <Avatar
          src={user.profileImage || "https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg"}
          icon={<UserOutlined />}
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {currentDepartment?.name || user.department?.name || ""}
          </p>
        </div>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;