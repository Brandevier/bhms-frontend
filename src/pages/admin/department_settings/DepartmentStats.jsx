// DepartmentStats.jsx
import React from 'react';
import { Card, Row, Col, Statistic, Tag, Divider } from 'antd';
import { 
  TeamOutlined, 
  HomeOutlined, 
  UserOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const DepartmentStats = ({ department }) => {
  const beds = department.bed || [];
  const patients = department.patients || [];
  const staff = department.staff || [];
  const records = department.records || [];

  const availableBeds = beds.filter(bed => bed.status === 'available' && !bed.is_occupied).length;
  const occupiedBeds = beds.filter(bed => bed.is_occupied || bed.status === 'occupied').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'maintenance').length;

  return (
    <Card title="Department Overview" className="mb-6">
      <Row gutter={16}>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Total Beds"
            value={beds.length}
            prefix={<HomeOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Available Beds"
            value={availableBeds}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Occupied Beds"
            value={occupiedBeds}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Maintenance"
            value={maintenanceBeds}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Current Patients"
            value={patients.length}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Staff Members"
            value={staff.length}
            prefix={<TeamOutlined />}
          />
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <Statistic
            title="Medical Records"
            value={records.length}
            prefix={<FileTextOutlined />}
          />
        </Col>
        <Col xs={12} sm={6} className="mb-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1">Department Type</span>
            <Tag color="blue" className="text-sm">
              {department.departmentType || 'N/A'}
            </Tag>
          </div>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={24}>
          <div className="text-sm text-gray-600">
            <strong>Description:</strong> {department.description || 'No description available'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <strong>Department Number:</strong> {department.department_number || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <strong>Created:</strong> {moment(department.createdAt).format('MMMM Do, YYYY')}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default DepartmentStats;