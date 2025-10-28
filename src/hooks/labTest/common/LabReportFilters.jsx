import React from "react";
import { Select, Input, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

const LabReportFilters = ({ filters, onFiltersChange }) => {
  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handleSearch = (value) => {
    onFiltersChange({ ...filters, search: value });
  };

  const resetFilters = () => {
    onFiltersChange({ status: 'all', search: '', dateRange: null });
  };

  return (
    <Space>
      <Select
        value={filters.status}
        onChange={handleStatusChange}
        style={{ width: 120 }}
        size="small"
      >
        <Option value="all">All Status</Option>
        <Option value="pending">Pending</Option>
        <Option value="in_progress">In Progress</Option>
        <Option value="completed">Completed</Option>
        <Option value="cancelled">Cancelled</Option>
      </Select>

      <Search
        placeholder="Search tests..."
        onSearch={handleSearch}
        style={{ width: 200 }}
        size="small"
        allowClear
      />

      <Button
        icon={<ReloadOutlined />}
        onClick={resetFilters}
        size="small"
        type="text"
      >
        Reset
      </Button>
    </Space>
  );
};

export default LabReportFilters;