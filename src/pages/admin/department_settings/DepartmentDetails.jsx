// DepartmentDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Row, Col, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getDepartment, deleteDepartment } from '../../../redux/slice/departmentSlice';
import DepartmentStats from './DepartmentStats';
import BedsManagement from './BedsManagement';
import PatientsList from './PatientsList';
import StaffList from './StaffList';
import RecordsList from './RecordsList';

const { confirm } = Modal;

const DepartmentDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { department, loading, error } = useSelector(state => state.departments);

  useEffect(() => {
    dispatch(getDepartment({ department_id: id }));
  }, [dispatch, id]);

  const handleDeleteDepartment = () => {
    confirm({
      title: 'Are you sure you want to delete this department?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All beds and associated data will be removed.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        dispatch(deleteDepartment({ department_id: id }))
          .unwrap()
          .then(() => {
            message.success('Department deleted successfully');
            // Redirect to departments list
            window.location.href = '/shared/departments';
          })
          .catch(err => {
            message.error('Failed to delete department: ' + (err.message || 'Unknown error'));
          });
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading department details..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Department"
        description={typeof error === 'object' ? JSON.stringify(error) : error || 'Failed to load department details. Please try again.'}
        type="error"
        showIcon
      />
    );
  }

  // Handle the case where department is an array with one item
  const departmentData = department && department.length > 0 ? department[0] : null;

  if (!departmentData) {
    return (
      <Alert
        message="Department Not Found"
        description="The requested department could not be found."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{departmentData.name}</h1>
        <Button 
          type="primary" 
          danger 
          onClick={handleDeleteDepartment}
          loading={loading}
        >
          Delete Department
        </Button>
      </div>

      <DepartmentStats department={departmentData} />

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <BedsManagement 
            department={departmentData} 
            beds={departmentData.bed || []} 
          />
        </Col>
        <Col xs={24} lg={12}>
          <PatientsList 
            patients={departmentData.patients || []} 
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <StaffList 
            staff={departmentData.staff || []} 
          />
        </Col>
        <Col xs={24} lg={12}>
          <RecordsList 
            records={departmentData.records || []} 
          />
        </Col>
      </Row>
    </div>
  );
};

export default DepartmentDetails;