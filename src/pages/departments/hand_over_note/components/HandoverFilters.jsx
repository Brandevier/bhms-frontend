import React from 'react';
import { Card, Select, DatePicker, Space, Button, Input } from 'antd';
import { 
  FilterOutlined, 
  ReloadOutlined,
  SearchOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const HandoverFilters = ({ filters, onFiltersChange, onReset, loading }) => {
  return (
    <Card className="mb-6 border-0 rounded-xl shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        <div className="lg:w-64">
          <Search
            placeholder="Search patients or notes..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={filters.search}
            onChange={(e) => onFiltersChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters */}
        <Space size="middle" wrap>
          <Select
            placeholder="Shift"
            value={filters.shift}
            onChange={(value) => onFiltersChange('shift', value)}
            style={{ width: 120 }}
            size="large"
            allowClear
          >
            <Option value="morning">Morning</Option>
            <Option value="afternoon">Afternoon</Option>
            <Option value="night">Night</Option>
          </Select>

          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(value) => onFiltersChange('status', value)}
            style={{ width: 140 }}
            size="large"
            allowClear
          >
            <Option value="draft">Draft</Option>
            <Option value="submitted">Submitted</Option>
            <Option value="acknowledged">Acknowledged</Option>
          </Select>

          <RangePicker
            placeholder={['Start Date', 'End Date']}
            onChange={(dates) => onFiltersChange('dateRange', dates)}
            size="large"
            style={{ width: 280 }}
          />

          {/* Action Buttons */}
          <Space>
            <Button
              icon={<FilterOutlined />}
              type="primary"
              ghost
              size="large"
              onClick={() => {/* Apply filters logic */}}
            >
              Apply
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={onReset}
              size="large"
              loading={loading}
            >
              Reset
            </Button>
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default HandoverFilters;