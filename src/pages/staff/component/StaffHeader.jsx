// src/components/staff/layout/StaffHeader.js
import React, { useEffect } from "react";
import { Layout, Dropdown, Avatar, Badge, List, Button, message, Modal, Spin } from "antd";
import { BellOutlined, UserOutlined, SwapOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logout } from "../../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useStaffDepartmentActions } from "../../../redux/hooks/useStaffDepartment";
import { useStaffDepartmentSwitch } from "../../../redux/hooks/useStaffDepartmentSwitch";

const { Header } = Layout;

const StaffHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.notification);

  const {
    currentDepartment,
    availableDepartments,
    switchDepartment,
    setDepartments,
    loading,
    setLoading,
    setError,
    clearError,
  } = useStaffDepartmentSwitch();

  const { fetchStaffDepartments, currentStaffDepartments } = useStaffDepartmentActions();

  const [departmentModalVisible, setDepartmentModalVisible] = React.useState(false);

  // Fetch staff departments when modal opens
  useEffect(() => {
    if (departmentModalVisible && user?.id) {
      setLoading(true);
      fetchStaffDepartments(user.id).finally(() => setLoading(false));
    }
  }, [departmentModalVisible, user?.id, fetchStaffDepartments, setLoading]);

  // Update departments when fetched - FIXED: Use departmentType instead of name
  useEffect(() => {
    if (currentStaffDepartments && currentStaffDepartments.length > 0) {
      const departments = currentStaffDepartments.map((item) => ({
        id: item.department_id,
        name: item.department?.name,
        type: item.department?.departmentType, // ← THIS IS THE KEY FIX
        code: item.department?.department_number,
        access_type: item.access_type,
      }));
      setDepartments(departments);
      if (!currentDepartment && departments.length > 0) {
        switchDepartment(departments[0]);
      }
    }
  }, [currentStaffDepartments, currentDepartment, setDepartments, switchDepartment]);

  const unreadCount = items?.filter((item) => !item.is_read).length || 0;

  // --- Logout handler
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

  // --- Switch Department
  const handleSwitchDepartment = (department) => {
    if (!department) return;
    switchDepartment(department);
    message.success(`Switched to ${department.name} department`);
    localStorage.setItem("department_id", department.id);
    setDepartmentModalVisible(false);
    navigate("/shared/departments");
    clearError();
  };

  // --- Department Dropdown Modal
  const departmentModal = (
    <Modal
      title="Switch Department"
      open={departmentModalVisible}
      onCancel={() => setDepartmentModalVisible(false)}
      footer={null}
      destroyOnClose
    >
      <div className="h-64 overflow-y-auto border rounded-lg mt-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="small" /> <span className="ml-2">Loading departments...</span>
          </div>
        ) : availableDepartments.length > 0 ? (
          availableDepartments.map((dept) => (
            <div
              key={dept.id}
              className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${currentDepartment?.id === dept.id ? "bg-blue-100 border-r-2 border-blue-500" : ""
                }`}
              onClick={() => handleSwitchDepartment(dept)}
            >
              <div className="font-medium">{dept.name}</div>
              <div className="text-xs text-gray-500">
                Type: {dept.type} {dept.code && `| Code: ${dept.code}`}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Access: {dept.access_type}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No departments assigned.
          </div>
        )}
      </div>
    </Modal>
  );

  // --- User Menu
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

  // --- Notification Menu
  const notificationMenu = (
    <div className="w-80 md:w-96 bg-white shadow-lg rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
      <List
        dataSource={items.slice(0, 5)}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${!item.is_read ? "bg-gray-100" : ""
              }`}
          >
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: "#f56a00" }}>🔔</Avatar>}
              title={<span className="font-semibold text-gray-800">{item.title}</span>}
              description={<span className="text-gray-600 text-sm">{item.description}</span>}
            />
            <span className="text-xs text-gray-500">{moment(item.createdAt).fromNow()}</span>
          </List.Item>
        )}
      />
      <Button type="link" className="w-full text-center text-blue-500">
        View All
      </Button>
    </div>
  );

  return (
    <>
      <Header
        style={{
          backgroundColor: "white",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          padding: "0 16px",
          border: "1px solid #E5E7EB",
        }}
        className="flex justify-between items-center w-full"
      >
        {/* Hospital Name + Department */}
        <h1 className="hidden md:block text-lg font-semibold text-gray-800">
          {user.institution?.name} —{" "}
          <span className="text-blue-600">{currentDepartment?.name || "No Department"}</span>
        </h1>

        {/* Center: Department Switch */}
        <div className="flex-1 flex justify-center">
          <Button
            type="dashed"
            icon={<SwapOutlined />}
            onClick={() => setDepartmentModalVisible(true)}
            className="flex items-center gap-2"
            loading={loading}
          >
            {currentDepartment ? (
              <>
                <span className="truncate max-w-24">{currentDepartment.name}</span>
                {availableDepartments.length > 1 && (
                  <Badge count={availableDepartments.length} size="small" />
                )}
              </>
            ) : (
              "Select Department"
            )}
          </Button>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 md:gap-4">
            <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
              <Badge count={unreadCount} overflowCount={9}>
                <BellOutlined className="text-xl cursor-pointer text-gray-700 hover:text-gray-500" />
              </Badge>
            </Dropdown>

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
          </div>
        </div>
      </Header>

      {departmentModal}
    </>
  );
};

export default StaffHeader;