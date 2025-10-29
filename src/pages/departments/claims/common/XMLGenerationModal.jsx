// components/XMLGenerationModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  Card,
  Tag,
  Divider,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Space,
  Typography,
  Collapse,
  Alert,
  Progress,
  notification
} from 'antd';
import {
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  DownloadOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Title, Text } = Typography;
import { generateClaimXML } from '../../../../redux/slice/claimSlice';

const XMLGenerationModal = ({ visible, onCancel, onGenerate, loading = false }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    generateXMLLoading, 
    generateXMLError, 
    generateXMLProgress,
    generatedXMLData 
  } = useSelector((state) => state.claims);
  
  const [selectedFilters, setSelectedFilters] = useState({
    patientCategory: [],
    claimTypes: [],
    statuses: [],
    financialOptions: [],
    patientTypes: []
  });

  const [generationStep, setGenerationStep] = useState('idle'); // idle, generating, success, error
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setGenerationStep('idle');
      setDownloadUrl(null);
      form.resetFields();
      setSelectedFilters({
        patientCategory: [],
        claimTypes: [],
        statuses: [],
        financialOptions: [],
        patientTypes: []
      });
    }
  }, [visible, form]);

  // Handle generation progress and completion
  useEffect(() => {
    if (generateXMLProgress === 100 && generatedXMLData) {
      setGenerationStep('success');
      createDownloadLink(generatedXMLData);
      notification.success({
        message: 'XML Generated Successfully',
        description: 'Your claim XML file is ready for download.',
        placement: 'topRight',
      });
    }
  }, [generateXMLProgress, generatedXMLData]);

  // Handle errors
  useEffect(() => {
    if (generateXMLError) {
      setGenerationStep('error');
      notification.error({
        message: 'Generation Failed',
        description: generateXMLError,
        placement: 'topRight',
      });
    }
  }, [generateXMLError]);

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const isFilterSelected = (category, value) => {
    return selectedFilters[category].includes(value);
  };

  const createDownloadLink = (xmlData) => {
    try {
      // Create blob from XML data
      const blob = new Blob([xmlData], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error('Error creating download link:', error);
      notification.error({
        message: 'Download Error',
        description: 'Failed to create download file.',
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `claims-export-${moment().format('YYYY-MM-DD-HH-mm')}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      notification.info({
        message: 'Download Started',
        description: 'Your XML file is being downloaded.',
      });
    }
  };

  const handleGenerate = async (values) => {
    try {
      setGenerationStep('generating');
      
      // Prepare the payload
      const payload = {
        ...values,
        ...selectedFilters,
        // Format dates properly
        dateRange: values.dateRange ? [
          values.dateRange[0].format('YYYY-MM-DD'),
          values.dateRange[1].format('YYYY-MM-DD')
        ] : null,
        timestamp: moment().toISOString(),
        // Add institution info if available
        institutionId: localStorage.getItem('institution_id'),
        departmentId: localStorage.getItem('department_id')
      };

      // Dispatch the generation action
      const result = await dispatch(generateClaimXML(payload));
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to generate XML');
      }

    } catch (error) {
      setGenerationStep('error');
      console.error('XML Generation Error:', error);
    }
  };

  const handleCancel = () => {
    // Reset state when canceling
    setGenerationStep('idle');
    setDownloadUrl(null);
    onCancel();
  };

  const handleRetry = () => {
    setGenerationStep('idle');
    form.submit();
  };

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

  // Render different content based on generation step
  const renderContent = () => {
    switch (generationStep) {
      case 'generating':
        return (
          <div className="text-center py-8">
            <Progress
              type="circle"
              percent={generateXMLProgress || 0}
              width={80}
              className="mb-4"
            />
            <Title level={4}>Generating XML Report</Title>
            <Text type="secondary">
              Please wait while we process your claims data...
            </Text>
            <div className="mt-4">
              <Text className="text-gray-500">
                {generateXMLProgress < 30 && 'Fetching claim data...'}
                {generateXMLProgress >= 30 && generateXMLProgress < 70 && 'Processing and validating...'}
                {generateXMLProgress >= 70 && 'Finalizing XML format...'}
              </Text>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <Title level={4} className="text-green-600">XML Generated Successfully!</Title>
            <Text className="text-gray-600 block mb-6">
              Your claims data has been processed and formatted according to NHIS standards.
            </Text>
            
            <Card size="small" className="mb-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <Text strong>File Details:</Text>
                  <div className="text-sm text-gray-600">
                    • Format: XML (NHIS Standard)<br/>
                    • Generated: {moment().format('YYYY-MM-DD HH:mm')}<br/>
                    • Records: {generatedXMLData?.recordCount || 'Multiple'}
                  </div>
                </div>
              </div>
            </Card>

            <Space size="middle">
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                size="large"
              >
                Download XML File
              </Button>
              <Button 
                onClick={handleCancel}
                size="large"
              >
                Close
              </Button>
            </Space>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
            <Title level={4} className="text-red-600">Generation Failed</Title>
            <Alert
              message="XML Generation Error"
              description={generateXMLError || 'An unexpected error occurred while generating the XML file.'}
              type="error"
              showIcon
              className="mb-4 text-left"
            />
            <Space>
              <Button 
                type="primary" 
                onClick={handleRetry}
                loading={generateXMLLoading}
              >
                Try Again
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </div>
        );

      default:
        return (
          <>
            <Collapse defaultActiveKey={['1', '2']} ghost>
              {/* Date & Period Section */}
              <Panel header="📅 Date & Period" key="1">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item 
                      name="dateRange" 
                      label="Date Range"
                      rules={[{ required: true, message: 'Please select date range' }]}
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

              {/* Patient Category */}
              <Panel header="👥 Patient Category" key="2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <FilterTag
                    category="patientCategory"
                    value="inpatient"
                    label="In-Patient"
                    icon={<UserOutlined />}
                  />
                  <FilterTag
                    category="patientCategory"
                    value="outpatient"
                    label="Out-Patient"
                    icon={<UserOutlined />}
                  />
                  <FilterTag
                    category="patientCategory"
                    value="both"
                    label="Both"
                    icon={<TeamOutlined />}
                  />
                </div>
              </Panel>

              {/* Claim Types */}
              <Panel header="🏥 Claim Types" key="3">
                <div className="flex flex-wrap gap-2 mb-4">
                  <FilterTag
                    category="claimTypes"
                    value="consultation"
                    label="Consultation"
                    icon={<MedicineBoxOutlined />}
                  />
                  <FilterTag
                    category="claimTypes"
                    value="investigations"
                    label="Investigations"
                    icon={<MedicineBoxOutlined />}
                  />
                  <FilterTag
                    category="claimTypes"
                    value="drugs"
                    label="Drugs/Pharmacy"
                    icon={<MedicineBoxOutlined />}
                  />
                  <FilterTag
                    category="claimTypes"
                    value="procedures"
                    label="Procedures & Surgeries"
                    icon={<MedicineBoxOutlined />}
                  />
                  <FilterTag
                    category="claimTypes"
                    value="services"
                    label="Service Bills"
                    icon={<MedicineBoxOutlined />}
                  />
                </div>
              </Panel>

              {/* Status Filters */}
              <Panel header="📊 Status Filters" key="4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <FilterTag
                    category="statuses"
                    value="draft"
                    label="Draft"
                  />
                  <FilterTag
                    category="statuses"
                    value="approved"
                    label="Approved"
                  />
                  <FilterTag
                    category="statuses"
                    value="rejected"
                    label="Rejected"
                  />
                  <FilterTag
                    category="statuses"
                    value="resubmitted"
                    label="Resubmitted"
                  />
                  <FilterTag
                    category="statuses"
                    value="all"
                    label="All Statuses"
                  />
                </div>
              </Panel>

              {/* Financial Filters */}
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
                  <FilterTag
                    category="financialOptions"
                    value="free"
                    label="Free Services"
                    icon={<DollarOutlined />}
                  />
                  <FilterTag
                    category="financialOptions"
                    value="paid"
                    label="Paid Services"
                    icon={<DollarOutlined />}
                  />
                  <FilterTag
                    category="financialOptions"
                    value="copayment"
                    label="Co-payment Involved"
                    icon={<DollarOutlined />}
                  />
                </div>
              </Panel>

              {/* Patient Filters */}
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
                  <FilterTag
                    category="patientTypes"
                    value="nhis"
                    label="NHIS Patients"
                  />
                  <FilterTag
                    category="patientTypes"
                    value="private"
                    label="Private Patients"
                  />
                </div>
              </Panel>

              {/* Export Options */}
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
              <Button onClick={handleCancel} disabled={generateXMLLoading}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={generateXMLLoading}
                icon={<FileTextOutlined />}
                className="bg-blue-600"
                disabled={!form.getFieldValue('dateRange')} // Disable if no date range selected
              >
                Generate Report
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-blue-500" />
          <span>Generate XML Report</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={null}
      centered
      closable={!generateXMLLoading} // Disable close while loading
      maskClosable={!generateXMLLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleGenerate}
        className="mt-4"
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default XMLGenerationModal;