// src/components/staff/layout/HeaderComponents/UserDropdown.js
import React, { useState } from 'react';
import { Dropdown, Avatar, Modal, message, Badge, Tag, Tooltip, Divider } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined, 
  ProfileOutlined,
  BellOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  HistoryOutlined,
  KeyOutlined,
  CrownOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../redux/slice/authSlice';
import './UserDropdown.css'; // Optional CSS file for custom styles

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentDepartment } = useSelector((state) => state.staffDepartment);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      icon: <LogoutOutlined />,
      okText: "Yes, Logout",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(logout());
        message.success("You have been logged out successfully");
        navigate("/staff/login");
      },
    });
  };

  const handleMenuClick = (key) => {
    setDropdownVisible(false);
    switch (key) {
      case 'profile':
        navigate("/shared/profile");
        break;
      case 'settings':
        navigate("#");
        break;
      case 'security':
        navigate("#");
        break;
      case 'notifications':
        navigate("#");
        break;
      case 'activity':
        navigate("#");
        break;
      case 'switch-role':
        navigate("/staff/switch-role");
        break;
      default:
        break;
    }
  };

  const getUserInitials = () => {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleBadgeColor = (role) => {
    const roleColors = {
      'Doctor': 'blue',
      'Admin': 'red',
      'Nurse': 'green',
      'Staff': 'orange',
      'Manager': 'purple'
    };
    return roleColors[role] || 'default';
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const userMenu = (
    <div className="user-dropdown-menu">
      {/* Header Section */}
      <div className="user-dropdown-header">
        <div className="user-avatar-section">
          <Badge 
            dot 
            status={user.has_face_registered ? "success" : "warning"}
            offset={[-2, 38]}
          >
            <Avatar
              size={48}
              src={user.profile_pic || "https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg"}
              icon={!user.profile_pic && <UserOutlined />}
              className="user-avatar"
            >
              {!user.profile_pic && getUserInitials()}
            </Avatar>
          </Badge>
        </div>
        <div className="user-info-section">
          <div className="user-name">
            {user.firstName} {user.middleName || ''} {user.lastName}
          </div>
          <div className="user-staff-id">
            {user.staffID}
          </div>
          <div className="user-role-tags">
            <Tag 
              color={getRoleBadgeColor(user.role?.name)} 
              icon={user.is_incharge ? <CrownOutlined /> : null}
              className="role-tag"
            >
              {user.role?.name}
              {user.is_incharge && ' (In Charge)'}
            </Tag>
            {!user.has_face_registered && (
              <Tag color="orange" icon={<SecurityScanOutlined />}>
                Face ID Pending
              </Tag>
            )}
          </div>
        </div>
      </div>

      <Divider className="dropdown-divider" />

      {/* Department & Institution Info */}
      <div className="organization-info">
        <div className="info-item">
          <TeamOutlined className="info-icon" />
          <span className="info-text">
            {currentDepartment?.name || user.department?.name || 'No Department'}
          </span>
        </div>
        <div className="info-item">
          <SafetyCertificateOutlined className="info-icon" />
          <span className="info-text">
            {user.institution?.name}
          </span>
        </div>
        <div className="info-item">
          <HistoryOutlined className="info-icon" />
          <span className="info-text">
            Last login: {formatLastLogin(user.last_login)}
          </span>
        </div>
      </div>

      <Divider className="dropdown-divider" />

      {/* Menu Items */}
      <div className="menu-section">
        <div className="menu-item" onClick={() => handleMenuClick('profile')}>
          <ProfileOutlined className="menu-icon" />
          <span className="menu-text">My Profile</span>
        </div>
        
        <div className="menu-item" onClick={() => handleMenuClick('settings')}>
          <SettingOutlined className="menu-icon" />
          <span className="menu-text">Settings</span>
        </div>

        {/* <div className="menu-item" onClick={() => handleMenuClick('notifications')}>
          <BellOutlined className="menu-icon" />
          <span className="menu-text">Notifications</span>
          <Badge size="small" count={3} className="notification-badge" />
        </div>

        <div className="menu-item" onClick={() => handleMenuClick('security')}>
          <SecurityScanOutlined className="menu-icon" />
          <span className="menu-text">Security</span>
          {!user.has_face_registered && (
            <Badge dot status="warning" className="security-badge" />
          )}
        </div>

        <div className="menu-item" onClick={() => handleMenuClick('activity')}>
          <HistoryOutlined className="menu-icon" />
          <span className="menu-text">Activity Log</span>
        </div>
 */}
        {user.permissions && user.permissions.length > 0 && (
          <div className="menu-item" onClick={() => handleMenuClick('switch-role')}>
            <KeyOutlined className="menu-icon" />
            <span className="menu-text">Switch Role</span>
          </div>
        )}
      </div>

      <Divider className="dropdown-divider" />

      {/* Footer Actions */}
      <div className="menu-footer">
        <div className="logout-item" onClick={handleLogout}>
          <LogoutOutlined className="logout-icon" />
          <span className="logout-text">Sign Out</span>
        </div>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={userMenu}
      trigger={["click"]}
      placement="bottomRight"
      visible={dropdownVisible}
      onVisibleChange={setDropdownVisible}
      overlayClassName="user-dropdown-overlay"
    >
      <div className="user-dropdown-trigger">
        <Tooltip title="Account menu">
          <div className="trigger-content">
            <Badge 
              dot 
              status={user.has_face_registered ? "success" : "warning"}
              offset={[-2, 2]}
            >
              <Avatar
                size="small"
                src={user.profile_pic || "https://justicaanima.com/wp-content/uploads/2022/02/justicaanimablog.jpg"}
                icon={!user.profile_pic && <UserOutlined />}
                className="trigger-avatar"
              >
                {!user.profile_pic && getUserInitials()}
              </Avatar>
            </Badge>
            <div className="trigger-info">
              <div className="trigger-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="trigger-role">
                {user.role?.name} • {currentDepartment?.name || user.department?.name || 'No Dept'}
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;