import React from 'react';
import { Card, Select, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const PatientFilters = ({ 
  searchTerm, 
  onSearchChange, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-xl mb-6 bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Search
            placeholder="Search patients by name, folder number, or phone..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full sm:w-80"
            enterButton={<SearchOutlined />}
            allowClear
            size="large"
          />
          <Select
            value={activeTab}
            onChange={onTabChange}
            className="w-full sm:w-48"
            size="large"
          >
            <Option value="all">All Patients</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default PatientFilters;