import React from 'react';
import { Card, Input, Select, Space, Button, Typography } from 'antd';
import { SearchOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const LabTestsFilters = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalTests,
  originalTotal,
  onReset
}) => {
  const handleReset = () => {
    onSearchChange('');
    onStatusFilterChange('all');
  };

  return (
    <Card style={{ marginBottom: 24 }} bodyStyle={{ paddingBottom: 16 }}>
      <Space wrap size="middle" style={{ width: '100%' }}>
        <Search
          placeholder="Search tests..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        
        <Select
          value={statusFilter}
          onChange={onStatusFilterChange}
          style={{ width: 150 }}
          placeholder="Filter by status"
        >
          <Option value="all">All Status</Option>
          <Option value="pending">Pending</Option>
          <Option value="in_progress">In Progress</Option>
          <Option value="completed">Completed</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>

        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
        >
          Reset
        </Button>

        <Text type="secondary">
          Showing {totalTests} of {originalTotal} tests
        </Text>
      </Space>
    </Card>
  );
};

export default LabTestsFilters;