// components/DepartmentDropdown.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, message, Spin, Badge } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useStaffDepartmentActions } from "../../../redux/hooks/useStaffDepartment";
import { useStaffDepartmentSwitch } from "../../../redux/hooks/useStaffDepartmentSwitch";

const { Search } = Input;

const DepartmentDropdown = ({ user }) => {
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    fetchStaffDepartments, 
    currentStaffDepartments, 
    loading, 
    error 
  } = useStaffDepartmentActions();

  const {
    currentDepartment,
    availableDepartments,
    switchDepartment,
    setDepartments,
    setLoading,
    setError,
    clearError
  } = useStaffDepartmentSwitch();

  useEffect(() => {
    if (departmentModalVisible && user?.id) {
      fetchStaffDepartments(user.id);
    }
  }, [departmentModalVisible, user?.id, fetchStaffDepartments]);

  useEffect(() => {
    // When departments are fetched, update the available departments
    if (currentStaffDepartments && currentStaffDepartments.length > 0) {
      const departments = currentStaffDepartments.map(item => ({
        id: item.department_id,
        name: item.department?.name,
        code: item.department?.department_number,
        access_type: item.access_type,
        originalItem: item
      }));
      
      setDepartments(departments);
      
      // Set initial department if not already set
      if (!currentDepartment && departments.length > 0) {
        switchDepartment(departments[0]);
      }
    }
  }, [currentStaffDepartments, setDepartments, switchDepartment, currentDepartment]);

  useEffect(() => {
    if (error) {
      message.error("Failed to fetch departments");
      setError(error);
    }
  }, [error, setError]);

  const handleDepartmentSwitch = (department) => {
    if (!department) {
      message.warning("Please select a department");
      return;
    }
    
    switchDepartment(department);
    message.success(`Switched to ${department.name} department`);
    setDepartmentModalVisible(false);
    setSearchTerm("");
    clearError();
  };

  const filteredDepartments = availableDepartments.filter(dept =>
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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

      <Modal
        title="Switch Department"
        open={departmentModalVisible}
        onCancel={() => {
          setDepartmentModalVisible(false);
          setSearchTerm("");
          clearError();
        }}
        footer={null}
        width={400}
        destroyOnClose
      >
        <div className="my-4">
          <Search
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
            allowClear
          />
          
          <div className="h-64 overflow-y-auto border rounded-lg">
            {loading ? (
              <div className="p-4 text-center">
                <Spin size="small" /> Loading departments...
              </div>
            ) : filteredDepartments.length > 0 ? (
              filteredDepartments.map(dept => (
                <div 
                  key={dept.id}
                  className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                    currentDepartment?.id === dept.id ? "bg-blue-100 border-r-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleDepartmentSwitch(dept)}
                >
                  <div className="font-medium">{dept.name}</div>
                  {dept.code && (
                    <div className="text-xs text-gray-500">{dept.code}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Access: {dept.access_type}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {availableDepartments.length === 0 
                  ? "No departments assigned" 
                  : "No departments found matching your search"}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DepartmentDropdown;