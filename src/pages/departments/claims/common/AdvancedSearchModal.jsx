// components/AdvancedSearchModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Tag,
  Divider,
  Form,
  Row,
  Col,
  Card
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdvancedSearchModal = ({ visible, onCancel, onSearch, loading = false }) => {
  const [form] = Form.useForm();
  const [activeFilters, setActiveFilters] = useState({});

  const filterOptions = {
    attendanceType: ['Outpatient', 'Inpatient', 'Emergency', 'Referral'],
    claimStatus: ['Pending', 'Submitted', 'Approved', 'Rejected', 'Processing'],
    itemType: ['Medication', 'Diagnosis', 'Procedure', 'LabTest', 'Service'],
    gender: ['Male', 'Female']
  };

  const handleApplyFilters = (values) => {
    const filters = {};
    
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length === 0) return;
        filters[key] = value;
      }
    });

    setActiveFilters(filters);
    onSearch(filters);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
    
    // Also remove from form
    form.setFieldsValue({ [filterKey]: undefined });
    
    // Trigger search with updated filters
    onSearch(newFilters);
  };

  const handleClearAll = () => {
    setActiveFilters({});
    form.resetFields();
    onSearch({});
  };

  const renderFilterTag = (key, value) => {
    let displayValue = value;
    
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else if (value instanceof Object) {
      // Handle date range
      displayValue = `${value[0].format('MMM DD')} - ${value[1].format('MMM DD')}`;
    }

    return (
      <Tag
        key={key}
        closable
        onClose={() => handleRemoveFilter(key)}
        style={{ marginBottom: 4 }}
      >
        {key}: {displayValue}
      </Tag>
    );
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <FilterOutlined className="mr-2" />
          Advanced Search & Filters
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      centered
    >
      <div className="max-h-96 overflow-y-auto">
        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <Card size="small" className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Active Filters:</span>
              <Button
                type="link"
                size="small"
                onClick={handleClearAll}
                className="text-red-500"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(activeFilters).map(([key, value]) =>
                renderFilterTag(key, value)
              )}
            </div>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleApplyFilters}
          className="advanced-search-form"
        >
          <Row gutter={16}>
            {/* Basic Search */}
            <Col span={24}>
              <Form.Item
                name="searchText"
                label="Search Text"
              >
                <Input
                  placeholder="Search by patient name, ID, claim number..."
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Patient Filters */}
            <Col span={12}>
              <Form.Item name="patientId" label="Patient ID">
                <Input placeholder="Enter patient ID" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select gender">
                  {filterOptions.gender.map(gender => (
                    <Option key={gender} value={gender}>{gender}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Visit Filters */}
            <Col span={12}>
              <Form.Item name="attendanceType" label="Attendance Type">
                <Select placeholder="Select attendance type">
                  {filterOptions.attendanceType.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="attendanceNumber" label="Attendance Number">
                <Input placeholder="Enter attendance number" />
              </Form.Item>
            </Col>

            {/* Claim Filters */}
            <Col span={12}>
              <Form.Item name="claimStatus" label="Claim Status">
                <Select placeholder="Select claim status">
                  {filterOptions.claimStatus.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="claimReference" label="Claim Reference">
                <Input placeholder="Enter claim reference number" />
              </Form.Item>
            </Col>

            {/* Item Filters */}
            <Col span={12}>
              <Form.Item name="itemType" label="Item Type">
                <Select placeholder="Select item type">
                  {filterOptions.itemType.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gdrgCode" label="GDRG Code">
                <Input placeholder="Enter GDRG code" />
              </Form.Item>
            </Col>

            {/* Date Filters */}
            <Col span={24}>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker className="w-full" />
              </Form.Item>
            </Col>

            {/* Amount Filters */}
            <Col span={12}>
              <Form.Item name="minAmount" label="Min Amount">
                <Input type="number" placeholder="Minimum amount" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="maxAmount" label="Max Amount">
                <Input type="number" placeholder="Maximum amount" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="default"
              onClick={handleClearAll}
              danger
            >
              Clear
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SearchOutlined />}
            >
              Apply Filters
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AdvancedSearchModal;