import React from 'react';
import { Card, Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdmissionFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange
}) => {
  return (
    <Card className="filters-card">
      <div className="filters-container">
        <div className="search-filters">
          <Search
            placeholder="Search patients..."
            prefix={<SearchOutlined />}
            allowClear
            enterButton
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          
          <Select
            placeholder="Filter by status"
            className="status-filter"
            suffixIcon={<FilterOutlined />}
            onChange={setStatusFilter}
            value={statusFilter}
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="accepted">Accepted</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="discharged">Discharged</Option>
          </Select>
          
          <RangePicker
            showTime
            className="date-range-picker"
            onChange={setDateRange}
            value={dateRange}
          />
        </div>
        
        <Space className="action-buttons">
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            New Admission
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default AdmissionFilters;