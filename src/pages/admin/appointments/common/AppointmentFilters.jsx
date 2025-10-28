// AppointmentFilters.jsx
import React from 'react';
import { Select, DatePicker, Row, Col } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AppointmentFilters = ({ filters, setFilters, appointments }) => {
  const doctors = [...new Set(appointments?.map(a => a.staff_id).filter(Boolean))];
  
  const handleStatusChange = (value) => {
    setFilters({ ...filters, status: value });
  };

  const handleDoctorChange = (value) => {
    setFilters({ ...filters, doctor: value });
  };

  const handleDateChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center mb-3">
        <FilterOutlined className="text-blue-500 mr-2" />
        <span className="font-medium">Filter Appointments</span>
      </div>
      
      <Row gutter={16}>
        <Col xs={24} sm={8} className="mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="all">All Statuses</Option>
              <Option value="scheduled">Scheduled</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </div>
        </Col>
        
        <Col xs={24} sm={8} className="mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <Select
              value={filters.doctor}
              onChange={handleDoctorChange}
              style={{ width: '100%' }}
            >
              <Option value="all">All Doctors</Option>
              {doctors.map(doctorId => {
                const doctor = appointments?.find(a => a.staff_id === doctorId)?.doctor;
                return (
                  <Option key={doctorId} value={doctorId}>
                    {doctor ? `${doctor.firstName || ''} ${doctor.lastName || ''}` : doctorId}
                  </Option>
                );
              })}
            </Select>
          </div>
        </Col>
        
        <Col xs={24} sm={8} className="mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentFilters;