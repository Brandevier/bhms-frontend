// src/components/staff/layout/StaffHeader.js
import React, { useEffect } from "react";
import { Layout, Dropdown, Avatar, Badge, List, Button, message, Modal, Spin, Tag } from "antd";
import { 
  BellOutlined, 
  UserOutlined, 
  SwapOutlined, 
  VideoCameraOutlined,
  MessageOutlined 
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logout } from "../../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useStaffDepartmentActions } from "../../../redux/hooks/useStaffDepartment";
import { useStaffDepartmentSwitch } from "../../../redux/hooks/useStaffDepartmentSwitch";
import { fetchNotifications } from "../../../redux/slice/notificationSlice";

// Import components
import MessageDropdown from "./HeaderComponents/MessageDropdown";
import NotificationDropdown from "./HeaderComponents/NotificationDropdown";
import UserDropdown from "./HeaderComponents/UserDropdown";
import DepartmentModal from "./HeaderComponents/DepartmentModal";
import VideoCallSection from "./HeaderComponents/VideoCallSection";

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
    loading: departmentLoading,
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

  // Update departments when fetched
  useEffect(() => {
    if (currentStaffDepartments && currentStaffDepartments.length > 0) {
      const departments = currentStaffDepartments.map((item) => ({
        id: item.department_id,
        name: item.department?.name,
        type: item.department?.departmentType,
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
            loading={departmentLoading}
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

        {/* Right: Messages + Video Call + Notifications + Profile */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-2 md:gap-4">
           
            <VideoCallSection />
             <MessageDropdown />
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </div>
      </Header>

      <DepartmentModal
        visible={departmentModalVisible}
        onCancel={() => setDepartmentModalVisible(false)}
        currentDepartment={currentDepartment}
        availableDepartments={availableDepartments}
        departmentLoading={departmentLoading}
        onSwitchDepartment={handleSwitchDepartment}
      />
    </>
  );
};

export default StaffHeader;