// components/maternity/ANCFilters.js
import React from 'react';
import { Card, Input, Select, Button, Typography } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const ANCFilters = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      ...filters,
      searchText: '',
      attendanceType: 'all',
      status: 'all'
    });
  };

  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Title level={5} className="flex items-center m-0">
          <FilterOutlined className="mr-2" />
          Filter Patients
        </Title>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Search
            placeholder="Search by name, attendance or folder no."
            allowClear
            enterButton={<SearchOutlined />}
            size="medium"
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            className="w-full md:w-64"
          />
          
          <Select
            placeholder="Attendance Type"
            value={filters.attendanceType}
            onChange={(value) => handleFilterChange('attendanceType', value)}
            allowClear
            className="w-full md:w-40"
          >
            <Option value="all">All Types</Option>
            <Option value="New">New</Option>
            <Option value="Follow-up">Follow-up</Option>
            <Option value="Emergency">Emergency</Option>
            <Option value="Referral">Referral</Option>
            <Option value="Transfer">Transfer</Option>
          </Select>
          
          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            allowClear
            className="w-full md:w-40"
          >
            <Option value="all">All Status</Option>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
          
          <Button 
            type="default" 
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ANCFilters;