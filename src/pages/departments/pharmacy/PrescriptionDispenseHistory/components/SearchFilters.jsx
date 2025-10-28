import React from 'react';
import { Input, DatePicker, Select, Button, Row, Col, Space, Tag, Card } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ClearOutlined,
  UserOutlined,
  MedicineBoxOutlined 
} from '@ant-design/icons';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchFilters = ({ filters, onFiltersChange, totalPatients, totalPrescriptions }) => {
  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleReset = () => {
    onFiltersChange({
      searchText: '',
      dateRange: [],
      status: 'all',
      department: 'all'
    });
  };

  const hasActiveFilters = filters.searchText || filters.dateRange.length > 0 || 
                          filters.status !== 'all' || filters.department !== 'all';

  return (
    <div>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12} lg={8}>
          <Search
            placeholder="Search patients, medications, or departments..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={filters.searchText}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            onSearch={(value) => handleFilterChange('searchText', value)}
            prefix={<UserOutlined className="text-gray-400" />}
          />
        </Col>

        <Col xs={24} md={12} lg={6}>
          <RangePicker
            style={{ width: '100%' }}
            size="large"
            value={filters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            format="DD/MM/YYYY"
            placeholder={['Start Date', 'End Date']}
          />
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Select
            style={{ width: '100%' }}
            size="large"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="dispensed">Dispensed</Option>
            <Option value="pending">Pending</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Col>

        <Col xs={24} md={12} lg={4}>
          <Select
            style={{ width: '100%' }}
            size="large"
            value={filters.department}
            onChange={(value) => handleFilterChange('department', value)}
            placeholder="Department"
          >
            <Option value="all">All Departments</Option>
            <Option value="consultation">Consultation</Option>
            <Option value="emergency">Emergency</Option>
            <Option value="opd">OPD</Option>
          </Select>
        </Col>

        <Col xs={24} md={12} lg={2}>
          <Space>
            <Button
              icon={<FilterOutlined />}
              type={hasActiveFilters ? "primary" : "default"}
              size="large"
              onClick={() => {}} // Additional filter panel could go here
            >
              Filters
            </Button>
            
            {hasActiveFilters && (
              <Button
                icon={<ClearOutlined />}
                onClick={handleReset}
                size="large"
              >
                Clear
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* Active Filters & Results Summary */}
      <div className="mt-4">
        <Row justify="space-between" align="middle">
          <Col>
            {hasActiveFilters && (
              <Space wrap>
                {filters.searchText && (
                  <Tag closable onClose={() => handleFilterChange('searchText', '')}>
                    Search: "{filters.searchText}"
                  </Tag>
                )}
                {filters.dateRange.length > 0 && (
                  <Tag closable onClose={() => handleFilterChange('dateRange', [])}>
                    Date: {filters.dateRange[0]?.format('DD/MM/YY')} - {filters.dateRange[1]?.format('DD/MM/YY')}
                  </Tag>
                )}
                {filters.status !== 'all' && (
                  <Tag closable onClose={() => handleFilterChange('status', 'all')}>
                    Status: {filters.status}
                  </Tag>
                )}
                {filters.department !== 'all' && (
                  <Tag closable onClose={() => handleFilterChange('department', 'all')}>
                    Dept: {filters.department}
                  </Tag>
                )}
              </Space>
            )}
          </Col>
          
          <Col>
            <Space>
              <Tag color="blue" icon={<UserOutlined />}>
                {totalPatients} Patients
              </Tag>
              <Tag color="green" icon={<MedicineBoxOutlined />}>
                {totalPrescriptions} Prescriptions
              </Tag>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchFilters;