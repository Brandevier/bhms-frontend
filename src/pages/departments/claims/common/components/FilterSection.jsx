// src/components/claims/XMLGeneration/components/FilterSection.jsx
import React from 'react';
import {
  Form,
  Select,
  DatePicker,
  Button,
  Card,
  Tag,
  Divider,
  Row,
  Col,
  InputNumber,
  Space,
  Typography,
  Collapse
} from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Title } = Typography;

const FilterSection = ({
  form,
  selectedFilters,
  onGenerate,
  onCancel,
  loading,
  toggleFilter,
  isFilterSelected
}) => {
  const FilterTag = ({ category, value, label, icon }) => (
    <Tag
      color={isFilterSelected(category, value) ? 'blue' : 'default'}
      onClick={() => toggleFilter(category, value)}
      style={{ cursor: 'pointer', marginBottom: 4, padding: '4px 8px' }}
      icon={icon}
    >
      {label}
    </Tag>
  );

  return (
    <>
      <Collapse defaultActiveKey={['1', '2']} ghost>
        <Panel header="📅 Date & Period" key="1">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="dateRange" 
                label="Date Range (Optional)"
              >
                <RangePicker 
                  className="w-full" 
                  disabledDate={(current) => current && current > moment().endOf('day')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="periodType" label="Period Type">
                <Select placeholder="Select period type">
                  <Option value="month">By Month</Option>
                  <Option value="week">By Week</Option>
                  <Option value="year">By Year</Option>
                  <Option value="custom">Custom Range</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel header="👥 Patient Category" key="2">
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterTag category="patientCategory" value="inpatient" label="In-Patient" icon={<UserOutlined />} />
            <FilterTag category="patientCategory" value="outpatient" label="Out-Patient" icon={<UserOutlined />} />
            <FilterTag category="patientCategory" value="both" label="Both" icon={<TeamOutlined />} />
          </div>
        </Panel>

        <Panel header="🏥 Claim Types" key="3">
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterTag category="claimTypes" value="consultation" label="Consultation" icon={<MedicineBoxOutlined />} />
            <FilterTag category="claimTypes" value="investigations" label="Investigations" icon={<MedicineBoxOutlined />} />
            <FilterTag category="claimTypes" value="drugs" label="Drugs/Pharmacy" icon={<MedicineBoxOutlined />} />
            <FilterTag category="claimTypes" value="procedures" label="Procedures & Surgeries" icon={<MedicineBoxOutlined />} />
            <FilterTag category="claimTypes" value="services" label="Service Bills" icon={<MedicineBoxOutlined />} />
          </div>
        </Panel>

        <Panel header="📊 Status Filters" key="4">
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterTag category="statuses" value="draft" label="Draft" />
            <FilterTag category="statuses" value="approved" label="Approved" />
            <FilterTag category="statuses" value="rejected" label="Rejected" />
            <FilterTag category="statuses" value="resubmitted" label="Resubmitted" />
            <FilterTag category="statuses" value="all" label="All Statuses" />
          </div>
        </Panel>

        <Panel header="💰 Financial Filters" key="5">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minAmount" label="Minimum Amount">
                <InputNumber
                  placeholder="Min amount"
                  className="w-full"
                  min={0}
                  formatter={value => `GHC ${value}`}
                  parser={value => value.replace('GHC ', '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxAmount" label="Maximum Amount">
                <InputNumber
                  placeholder="Max amount"
                  className="w-full"
                  min={0}
                  formatter={value => `GHC ${value}`}
                  parser={value => value.replace('GHC ', '')}
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterTag category="financialOptions" value="free" label="Free Services" icon={<DollarOutlined />} />
            <FilterTag category="financialOptions" value="paid" label="Paid Services" icon={<DollarOutlined />} />
            <FilterTag category="financialOptions" value="copayment" label="Co-payment Involved" icon={<DollarOutlined />} />
          </div>
        </Panel>

        <Panel header="👤 Patient Filters" key="6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="both">Both</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ageGroup" label="Age Group">
                <Select placeholder="Select age group">
                  <Option value="children">Children (0-12)</Option>
                  <Option value="adults">Adults (13-59)</Option>
                  <Option value="elderly">Elderly (60+)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterTag category="patientTypes" value="nhis" label="NHIS Patients" />
            <FilterTag category="patientTypes" value="private" label="Private Patients" />
          </div>
        </Panel>

        <Panel header="💾 Export Options" key="7">
          <Form.Item name="exportFormat" label="Export Format" initialValue="xml">
            <Select>
              <Option value="xml">XML (NHIS Standard Format)</Option>
              <Option value="excel">Excel/CSV (For Review)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="splitBy" label="Split By">
            <Select placeholder="Select split option">
              <Option value="none">No Split</Option>
              <Option value="month">By Month</Option>
              <Option value="department">By Department</Option>
              <Option value="claimType">By Claim Type</Option>
            </Select>
          </Form.Item>
        </Panel>
      </Collapse>

      <Divider />

      {/* Selected Filters Summary */}
      {Object.values(selectedFilters).some(arr => arr.length > 0) && (
        <Card size="small" className="mb-4">
          <Title level={5}>Active Filters:</Title>
          <div className="flex flex-wrap gap-1">
            {Object.entries(selectedFilters).map(([category, values]) =>
              values.map(value => (
                <Tag 
                  key={`${category}-${value}`} 
                  color="blue" 
                  closable
                  onClose={() => toggleFilter(category, value)}
                >
                  {category}: {value}
                </Tag>
              ))
            )}
          </div>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<FileTextOutlined />}
          className="bg-blue-600"
        >
          Generate Report
        </Button>
      </div>
    </>
  );
};

export default FilterSection;