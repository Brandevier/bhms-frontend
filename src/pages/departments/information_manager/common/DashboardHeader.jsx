// components/bed/common/DashboardHeader.js
import React from 'react';
import { Typography, Select, Button } from 'antd';
import { BoxPlotFilled, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const DashboardHeader = ({ filters, loading, onDepartmentChange, onRefresh, onClearFilters }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
      <Title level={2} className="flex items-center">
        <BoxPlotFilled className="mr-3 text-blue-500" />
        Bed Management Dashboard
      </Title>
      
      <div className="flex items-center gap-4 mt-4 lg:mt-0">
        <Select
          placeholder="Filter by Department"
          value={filters?.department_id || undefined} // Added optional chaining
          onChange={onDepartmentChange}
          allowClear
          style={{ width: 200 }}
        >
          <Option value="dept1">Emergency Department</Option>
          <Option value="dept2">ICU</Option>
          <Option value="dept3">Maternity</Option>
          {/* Map through actual departments */}
        </Select>
        
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
          loading={loading}
        >
          Refresh
        </Button>
        
        {filters?.department_id && ( // Added optional chaining
          <Button onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;