// components/staff/StaffDepartments.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Spin, Empty, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../../../redux/slice/chatSlice';
import { 
  useStaffDepartmentActions, 
  useStaffDepartments, 
  useStaffDepartmentLoading, 
  useStaffDepartmentError,
  useStaffDepartmentSuccess 
} from '../../../redux/hooks/useStaffDepartment';
import DepartmentList from './DepartmentList';
import DepartmentModal from './DepartmentModal';




const { Title } = Typography;

const StaffDepartments = ({ staffId, staffName, onSave }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Get departments from Redux store
  const { departments, loading: departmentsLoading } = useSelector((state) => state.departments);
  
  // Get staff department state from hooks
  const staffDepartments = useStaffDepartments();
  const loading = useStaffDepartmentLoading();
  const error = useStaffDepartmentError();
  const success = useStaffDepartmentSuccess();
  const { 
    fetchStaffDepartments, 
    updateStaffDepartments, 
    removeStaffDepartment,
    clearStaffDepartmentError,
    clearStaffDepartmentSuccess 
  } = useStaffDepartmentActions();

  useEffect(() => {
    dispatch(fetchDepartments());
    if (staffId) {
      fetchStaffDepartments(staffId);
    }
  }, [dispatch, staffId, fetchStaffDepartments]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearStaffDepartmentError();
    }
  }, [error, clearStaffDepartmentError]);

  useEffect(() => {
    if (success) {
      message.success('Departments updated successfully');
      clearStaffDepartmentSuccess();
      setModalVisible(false);
      if (onSave) onSave();
    }
  }, [success, clearStaffDepartmentSuccess, onSave]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleUpdateDepartments = (selectedDepartments, departmentAccessTypes) => {
    if (!staffId) {
      message.error('Staff ID is required');
      return;
    }

    // Format the data correctly for the API
    const departmentData = {
      staff_id: staffId,
      department_ids: selectedDepartments, // This should be an array of IDs
      access_types: selectedDepartments.map(deptId => ({
        department_id: deptId,
        access_type: departmentAccessTypes[deptId] || 'full access'
      }))
    };

    updateStaffDepartments(departmentData);
  };

  const handleRemoveDepartment = (departmentId) => {
    if (!staffId) {
      message.error('Staff ID is required');
      return;
    }

    removeStaffDepartment({
      staff_id: staffId,
      department_id: departmentId
    }).then(() => {
      if (onSave) onSave();
    });
  };

  const handleRefresh = () => {
    if (staffId) {
      fetchStaffDepartments(staffId);
    }
  };

  if (departmentsLoading) {
    return (
      <Card title="Department Access" className="mt-6">
        <div className="flex justify-center items-center py-8">
          <Spin tip="Loading departments..." />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        title={
          <div className="flex items-center justify-between">
            <span>Department Access</span>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={loading}
              size="small"
              type="text"
            />
          </div>
        }
        className="mt-6"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleOpenModal}
            size="small"
            loading={loading}
          >
            Manage Access
          </Button>
        }
      >
        <DepartmentList
          staffDepartments={staffDepartments}
          loading={loading}
          onRemoveDepartment={handleRemoveDepartment}
          onOpenModal={handleOpenModal}
          staff_id={staffId}
          on_departmentUpdate = {()=>handleRefresh(staffId)}
        />
      </Card>

      <DepartmentModal
        visible={modalVisible}
        onCancel={handleCloseModal}
        onUpdate={handleUpdateDepartments}
        staffName={staffName}
        departments={departments}
        staffDepartments={staffDepartments}
        loading={loading}
      />
    </>
  );
};

export default StaffDepartments;