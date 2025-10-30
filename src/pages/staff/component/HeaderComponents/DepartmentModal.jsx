// src/components/staff/layout/HeaderComponents/DepartmentModal.js
import React from 'react';
import { Modal, Spin } from 'antd';

const DepartmentModal = ({
  visible,
  onCancel,
  currentDepartment,
  availableDepartments,
  departmentLoading,
  onSwitchDepartment
}) => {
  return (
    <Modal
      title="Switch Department"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <div className="h-64 overflow-y-auto border rounded-lg mt-3">
        {departmentLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="small" /> <span className="ml-2">Loading departments...</span>
          </div>
        ) : availableDepartments.length > 0 ? (
          availableDepartments.map((dept) => (
            <div
              key={dept.id}
              className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                currentDepartment?.id === dept.id ? "bg-blue-100 border-r-2 border-blue-500" : ""
              }`}
              onClick={() => onSwitchDepartment(dept)}
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
};

export default DepartmentModal;