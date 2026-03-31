import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Typography, Alert, Spin, Button, Tabs, Table,
  Tag, Space, Divider, List, Statistic, Progress, Badge, message,
  Input, Select, Modal, Form, Drawer, Empty, Radio
} from 'antd';
import {
  SafetyCertificateOutlined, ReloadOutlined, UploadOutlined,
  FileExcelOutlined, CheckCircleOutlined, CloseCircleOutlined,
  WarningOutlined, SyncOutlined, PlusOutlined, DeleteOutlined,
  EditOutlined, SearchOutlined, SettingOutlined, HistoryOutlined,
  DatabaseOutlined, ArrowRightOutlined, FilterOutlined, DownloadOutlined,
  PlayCircleOutlined, StopOutlined, CheckSquareOutlined, ClockCircleOutlined,
  DollarOutlined, FileTextOutlined, BarChartOutlined, PieChartOutlined,
  SaveOutlined, FileOutlined
} from '@ant-design/icons';
import XMLUploadSection from './common/XMLUploadSection';
import VettingResults from './common/VettingResults';
import useNHIAVetting from '../../../../redux/hooks/useNHIAVetting';

const { Title, Text } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const NHIAVettingModule = () => {
  const {
    uploadXMLFile,
    uploadStatus,
    uploadError,
    uploadResult,
    isUploadLoading,
    isUploadSuccess,
    isUploadFailed,
    resetUploadState,
    clearAllErrors,
    validationSummary,
    claims,
    overallStatus,
    validationRules,
    getValidationRules,
    mappings,
    getMappings,
    isMappingsLoading,
    isMappingsSuccess,
    mappingsPagination
  } = useNHIAVetting();

  // Local state
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [mappingModalVisible, setMappingModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState('csv');
  const [editingClaim, setEditingClaim] = useState(null);

  // Load validation rules and mappings on mount
  useEffect(() => {
    getValidationRules();
    getMappings({ page: 1, limit: 10 });
  }, []);

  // Calculate statistics from uploaded claims data
  const calculateStats = () => {
    if (!uploadResult?.data?.claims || uploadResult.data.claims.length === 0) {
      return {
        totalClaims: 0,
        totalServices: 0,
        passedServices: 0,
        failedServices: 0,
        successRate: 0,
        totalAmount: 0,
        validatedAmount: 0,
        pendingAmount: 0
      };
    }

    const claimsData = uploadResult.data.claims;
    let totalServicesCount = 0;
    let passedServicesCount = 0;
    let failedServicesCount = 0;
    let totalAmountSum = 0;
    let validatedAmountSum = 0;
    let pendingAmountSum = 0;

    claimsData.forEach(claim => {
      // Count services
      const servicesCount = claim.services?.length || 0;
      totalServicesCount += servicesCount;

      // Calculate amounts and check validation status from services
      let claimTotalAmount = 0;
      let claimValidatedAmount = 0;

      claim.services?.forEach(service => {
        const serviceTotal = service.totalAmount || 0;
        const serviceNhia = service.nhiaAmount || 0;
        
        claimTotalAmount += serviceTotal;
        claimValidatedAmount += serviceNhia;

        // Count passed/failed services
        if (service.validation?.isValid !== false) {
          passedServicesCount++;
        } else {
          failedServicesCount++;
        }
      });

      totalAmountSum += claimTotalAmount;
      validatedAmountSum += claimValidatedAmount;
      pendingAmountSum += (claimTotalAmount - claimValidatedAmount);
    });

    const successRate = totalServicesCount > 0 
      ? Math.round((passedServicesCount / totalServicesCount) * 100)
      : 0;

    return {
      totalClaims: claimsData.length,
      totalServices: totalServicesCount,
      passedServices: passedServicesCount,
      failedServices: failedServicesCount,
      successRate,
      totalAmount: totalAmountSum,
      validatedAmount: validatedAmountSum,
      pendingAmount: pendingAmountSum
    };
  };

  const stats = calculateStats();

  const handleXMLUpload = async (file) => {
    clearAllErrors();
    uploadXMLFile(file);
  };

  const handleSaveChanges = (updatedData) => {
    console.log('Saving changes:', updatedData);
    message.success('Changes saved successfully');
  };

  const handleRetry = () => {
    resetUploadState();
    clearAllErrors();
  };

  const handleRefreshRules = () => {
    getValidationRules();
    message.success('Validation rules refreshed');
  };

  const handleRefreshMappings = () => {
    getMappings({ page: 1, limit: 10 });
    message.success('Mappings refreshed');
  };

  const handleViewClaimDetails = (claim) => {
    setSelectedClaim(claim);
    setDetailsDrawerVisible(true);
  };

  // Export functionality
  const handleExport = () => {
    if (!uploadResult?.data?.claims || uploadResult.data.claims.length === 0) {
      message.warning('No claims to export. Please upload an XML file first.');
      return;
    }
    setExportModalVisible(true);
  };

  const performExport = (format) => {
    const claimsData = uploadResult.data.claims;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let content = '';
    let mimeType = 'text/plain';
    let filename = `nhia_claims_export_${timestamp}`;

    if (format === 'csv') {
      // CSV Export
      const headers = ['Claim ID', 'Patient Name', 'NHIS Number', 'Diagnosis', 'Service Code', 'Service Description', 'Quantity', 'Unit Price', 'Total Amount', 'NHIA Amount', 'Status'];
      const rows = claimsData.flatMap(claim => 
        claim.services?.map(service => [
          claim.claimId,
          claim.memberName || '',
          claim.nhisNumber || '',
          claim.diagnosis?.originalCode || '',
          service.serviceCode || '',
          service.description || '',
          service.quantity || 0,
          service.unitPrice || 0,
          service.totalAmount || 0,
          service.nhiaAmount || 0,
          service.validation?.isValid ? 'Valid' : 'Invalid'
        ]) || []
      );
      content = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      mimeType = 'text/csv';
      filename += '.csv';
    } else if (format === 'json') {
      // JSON Export
      const exportData = claimsData.map(claim => ({
        claimId: claim.claimId,
        memberName: claim.memberName,
        nhisNumber: claim.nhisNumber,
        diagnosis: claim.diagnosis,
        services: claim.services?.map(service => ({
          serviceCode: service.serviceCode,
          description: service.description,
          quantity: service.quantity,
          unitPrice: service.unitPrice,
          totalAmount: service.totalAmount,
          nhiaAmount: service.nhiaAmount,
          status: service.validation?.isValid ? 'Valid' : 'Invalid',
          issues: service.validation?.issues || []
        })) || [],
        totalAmount: claim.services?.reduce((sum, s) => sum + (s.totalAmount || 0), 0) || 0
      }));
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else if (format === 'xml') {
      // XML Export
      const xmlClaims = claimsData.map(claim => `
    <Claim>
      <ClaimID>${claim.claimId}</ClaimID>
      <MemberName>${claim.memberName || ''}</MemberName>
      <NHISNumber>${claim.nhisNumber || ''}</NHISNumber>
      <Diagnosis>${claim.diagnosis?.originalCode || ''}</Diagnosis>
      <Services>
        ${claim.services?.map(service => `
        <Service>
          <ServiceCode>${service.serviceCode || ''}</ServiceCode>
          <Description>${service.description || ''}</Description>
          <Quantity>${service.quantity || 0}</Quantity>
          <UnitPrice>${service.unitPrice || 0}</UnitPrice>
          <TotalAmount>${service.totalAmount || 0}</TotalAmount>
          <NHIAAmount>${service.nhiaAmount || 0}</NHIAAmount>
          <Status>${service.validation?.isValid ? 'Valid' : 'Invalid'}</Status>
        </Service>`).join('') || ''}
      </Services>
    </Claim>`).join('');
      content = `<?xml version="1.0" encoding="UTF-8"?>\n<Claims>${xmlClaims}\n</Claims>`;
      mimeType = 'application/xml';
      filename += '.xml';
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success(`Successfully exported ${claimsData.length} claims to ${format.toUpperCase()}`);
    setExportModalVisible(false);
  };

  // Edit functionality for failed claims
  const handleEditClaim = (claim) => {
    setEditingClaim(claim);
    setEditModalVisible(true);
  };

  const handleSaveEditedClaim = (editedClaim) => {
    // Update the claim in the uploadResult
    if (uploadResult?.data?.claims) {
      const updatedClaims = uploadResult.data.claims.map(c => 
        c.claimId === editingClaim.claimId ? { ...c, ...editedClaim } : c
      );
      // Update the Redux state or local state
      uploadResult.data.claims = updatedClaims;
    }
    message.success('Claim updated successfully');
    setEditModalVisible(false);
    setEditingClaim(null);
  };

  // Convert Redux status to local status for the XMLUploadSection
  const getUploadStatus = () => {
    if (isUploadLoading) return 'uploading';
    if (isUploadSuccess) return 'success';
    if (isUploadFailed) return 'error';
    return 'idle';
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return 'GHS 0.00';
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `GHS ${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `GHS ${(num / 1000).toFixed(1)}K`;
    }
    return `GHS ${num.toFixed(2)}`;
  };

  // Claims table columns
  const claimsColumns = [
    {
      title: 'Claim ID',
      dataIndex: 'claimId',
      key: 'claimId',
      render: (id) => <Text code>{id?.slice(0, 12)}...</Text>,
      width: 150,
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.patientName || 'N/A'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.nhisNumber || 'N/A'}</Text>
        </Space>
      ),
      width: 200,
    },
    {
      title: 'Services',
      dataIndex: 'serviceCount',
      key: 'serviceCount',
      render: (count) => <Badge count={count} showZero color="#1890ff" />,
      width: 80,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
      align: 'right',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          valid: 'green',
          invalid: 'red',
          warning: 'orange'
        };
        return <Tag color={colors[status] || 'default'}>{status?.toUpperCase()}</Tag>;
      },
      width: 100,
    },
    {
      title: 'Issues',
      dataIndex: 'issues',
      key: 'issues',
      render: (issues) => issues?.length > 0 ? (
        <Tag color="red">{issues.length} issues</Tag>
      ) : (
        <Tag color="green">Valid</Tag>
      ),
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => handleViewClaimDetails(record)}
            size="small"
          />
        </Space>
      ),
      width: 80,
    },
  ];

  // Mappings table columns
  const mappingsColumns = [
    {
      title: 'Local Code',
      dataIndex: 'localCode',
      key: 'localCode',
      render: (code) => <Text code>{code}</Text>,
    },
    {
      title: 'NHIA Code',
      dataIndex: 'nhiaCode',
      key: 'nhiaCode',
      render: (code) => <Text code>{code}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag>{cat}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active) => active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  // Quick actions
  const quickActions = [
    { key: 'upload', icon: <UploadOutlined />, label: 'Upload XML', color: '#1890ff' },
    { key: 'export', icon: <FileExcelOutlined />, label: 'Export Results', color: '#52c41a' },
    { key: 'validate', icon: <CheckSquareOutlined />, label: 'Re-validate', color: '#fa8c16' },
    { key: 'history', icon: <HistoryOutlined />, label: 'History', color: '#722ed1' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', color: '#595959' },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'upload':
        setActiveTab('upload');
        break;
      case 'export':
        handleExport();
        break;
      case 'validate':
        message.info('Re-validate functionality coming soon');
        break;
      case 'history':
        setActiveTab('history');
        break;
      case 'settings':
        setActiveTab('settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="vetting-erp-module">
      {/* ERP Header */}
      <div className="vetting-erp-header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon-bg">
              <SafetyCertificateOutlined className="header-icon" />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>NHIA Claims Vetting ERP</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                National Health Insurance Authority Claims Validation | {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </div>
          </div>
          <div className="header-actions">
            <Button
              icon={<SyncOutlined spin={isUploadLoading || isMappingsLoading} />}
              onClick={() => { handleRefreshRules(); handleRefreshMappings(); }}
            >
              Refresh
            </Button>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => setActiveTab('upload')}>
              New Upload
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="kpi-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card total-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Claims</span>}
              value={stats.totalClaims}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{stats.totalServices} services</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card total-services-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Services</span>}
              value={stats.totalServices}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{stats.totalClaims} claims</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card passed-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Passed Services</span>}
              value={stats.passedServices}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>{stats.successRate}% pass rate</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card failed-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Failed Services</span>}
              value={stats.failedServices}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Needs review</Text>
          </Card>
        </Col>
      </Row>

      {/* Success Rate Progress */}
      <Card className="progress-card" style={{ margin: '16px 24px' }}>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space>
              <Progress
                type="circle"
                percent={stats.successRate}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#52c41a',
                }}
                size={80}
              />
              <div>
                <Text strong style={{ fontSize: 18 }}>{stats.successRate}% Success Rate</Text>
                <br />
                <Text type="secondary">
                  {overallStatus === 'pass' ? (
                    <><CheckCircleOutlined style={{ color: '#52c41a' }} /> All claims validated</>
                  ) : overallStatus === 'fail' ? (
                    <><WarningOutlined style={{ color: '#ff4d4f' }} /> Validation failed</>
                  ) : (
                    <><ClockCircleOutlined /> Ready for validation</>
                  )}
                </Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>Valid Amount:</Text> {formatCurrency(stats.validatedAmount)}
              </Col>
              <Col span={12}>
                <Text strong>Invalid Amount:</Text> {formatCurrency(stats.totalAmount - stats.validatedAmount)}
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Quick Actions */}
      <Card className="quick-actions-card" style={{ margin: '0 24px 16px' }} title="Quick Actions">
        <Row gutter={[16, 16]}>
          {quickActions.map((action) => (
            <Col xs={12} sm={8} md={4} key={action.key}>
              <Button
                type="primary"
                icon={action.icon}
                onClick={() => handleQuickAction(action.key)}
                block
                style={{ background: action.color, borderColor: action.color }}
                className="quick-action-btn"
              >
                {action.label}
              </Button>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Main Content */}
      <div style={{ padding: '0 24px 24px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Upload Tab */}
          <TabPane tab={<span><UploadOutlined /> Upload & Validate</span>} key="upload">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title={<Space><UploadOutlined /> XML File Upload</Space>}>
                  <XMLUploadSection
                    onFileUpload={handleXMLUpload}
                    status={getUploadStatus()}
                    disabled={isUploadLoading}
                  />

                  {isUploadSuccess && uploadResult?.data && (
                    <VettingResults
                      results={uploadResult.data}
                      onSaveChanges={handleSaveChanges}
                    />
                  )}

                  {isUploadLoading && (
                    <Card style={{ marginTop: 24, textAlign: 'center' }}>
                      <Spin size="large" />
                      <Text style={{ display: 'block', marginTop: 16 }}>Processing XML file...</Text>
                    </Card>
                  )}

                  {isUploadFailed && (
                    <Card style={{ marginTop: 24 }}>
                      <Alert
                        message="Upload Failed"
                        description={
                          <div>
                            <p>{uploadError?.error || 'Failed to process the XML file'}</p>
                            <p>Please ensure it's a valid NHIA claims XML format.</p>
                          </div>
                        }
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                      />
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRetry}
                        type="primary"
                      >
                        Try Again
                      </Button>
                    </Card>
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title={<Space><CheckSquareOutlined /> Validation Rules</Space>}>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefreshRules}
                    size="small"
                    style={{ marginBottom: 16 }}
                    block
                  >
                    Refresh Rules
                  </Button>
                  <List
                    size="small"
                    dataSource={validationRules || [
                      'ICD-10 Code Validation',
                      'G-DRG Code Verification',
                      'NHIS Number Format Check',
                      'Price Range Validation',
                      'Claim Date Validity (30 days)',
                      'Diagnosis-GDRG Mapping'
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        {typeof item === 'string' ? item : item.ruleName || 'Validation Rule'}
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Claims Tab */}
          <TabPane tab={<span><FileTextOutlined /> Claims Details</span>} key="claims">
            <Card>
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={8}>
                  <Search
                    placeholder="Search claims..."
                    allowClear
                    prefix={<SearchOutlined />}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Select placeholder="Filter by status" style={{ width: '100%' }} allowClear>
                    <Option value="pass">Valid</Option>
                    <Option value="fail">Invalid</Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <Space>
                    <Button icon={<FilterOutlined />}>Apply</Button>
                    <Button icon={<DownloadOutlined />}>Export</Button>
                  </Space>
                </Col>
              </Row>

              {/* Use uploaded claims data if available */}
              <Table
                dataSource={(uploadResult?.data?.claims || []).map(claim => ({
                  ...claim,
                  patientName: claim.memberName,
                  status: claim.validationStatus === 'pass' ? 'valid' : 'invalid',
                  amount: claim.services?.reduce((sum, s) => sum + (s.totalAmount || 0), 0) || 0,
                  serviceCount: claim.services?.length || 0,
                  issues: claim.services?.filter(s => !s.validation?.isValid).map(s => s.validation?.issues).flat() || []
                }))}
                columns={claimsColumns}
                rowKey="claimId"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} claims`
                }}
                scroll={{ x: 900 }}
                locale={{ emptyText: <Empty description="No claims to display. Upload an XML file first." /> }}
              />
            </Card>
          </TabPane>

          {/* Mappings Tab */}
          <TabPane tab={<span><DatabaseOutlined /> Code Mappings</span>} key="mappings">
            <Card>
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Search
                    placeholder="Search mappings..."
                    allowClear
                    prefix={<SearchOutlined />}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Space>
                    <Button icon={<DownloadOutlined />}>Import</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setMappingModalVisible(true)}>
                      Add Mapping
                    </Button>
                  </Space>
                </Col>
              </Row>

              <Table
                dataSource={mappings || []}
                columns={mappingsColumns}
                rowKey="id"
                loading={isMappingsLoading}
                pagination={{
                  current: mappingsPagination?.currentPage || 1,
                  total: mappingsPagination?.totalItems || 0,
                  pageSize: mappingsPagination?.itemsPerPage || 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} mappings`
                }}
                scroll={{ x: 800 }}
                locale={{ emptyText: <Empty description="No mappings configured." /> }}
              />
            </Card>
          </TabPane>

          {/* History Tab */}
          <TabPane tab={<span><HistoryOutlined /> History</span>} key="history">
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Alert
                    message="Vetting History"
                    description="View and manage previous XML vetting sessions. Export reports and re-process claims as needed."
                    type="info"
                    showIcon
                  />
                </Col>
                <Col span={24}>
                  <List
                    bordered
                    dataSource={[
                      { date: '2024-01-15', file: 'claims_batch_001.xml', claims: 45, status: 'completed' },
                      { date: '2024-01-14', file: 'claims_batch_002.xml', claims: 32, status: 'completed' },
                      { date: '2024-01-13', file: 'claims_batch_003.xml', claims: 58, status: 'completed' },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button key="view" type="link">View</Button>,
                          <Button key="export" type="link">Export</Button>,
                          <Button key="reprocess" type="link">Re-process</Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<FileExcelOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                          title={`${item.file} - ${item.claims} claims`}
                          description={
                            <Space>
                              <ClockCircleOutlined /> {item.date}
                              <Tag color="green">{item.status}</Tag>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* Settings Tab */}
          <TabPane tab={<span><SettingOutlined /> Settings</span>} key="settings">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Validation Settings">
                  <Form layout="vertical">
                    <Form.Item label="Auto-validate on upload">
                      <Select defaultValue="true" style={{ width: '100%' }}>
                        <Option value="true">Yes</Option>
                        <Option value="false">No</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Strict Mode">
                      <Select defaultValue="warning" style={{ width: '100%' }}>
                        <Option value="strict">Strict - Reject invalid</Option>
                        <Option value="warning">Warning - Allow with warnings</Option>
                        <Option value="lenient">Lenient - Allow all</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Claim Age Limit (days)">
                      <Input type="number" defaultValue={30} />
                    </Form.Item>
                    <Button type="primary">Save Settings</Button>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Export Settings">
                  <Form layout="vertical">
                    <Form.Item label="Export Format">
                      <Select defaultValue="xml" style={{ width: '100%' }}>
                        <Option value="xml">NHIA XML Format</Option>
                        <Option value="json">JSON</Option>
                        <Option value="csv">CSV</Option>
                        <Option value="xlsx">Excel (XLSX)</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Include Fields">
                      <Select mode="multiple" defaultValue={['claims', 'services', 'amounts']} style={{ width: '100%' }}>
                        <Option value="claims">Claims Data</Option>
                        <Option value="services">Service Details</Option>
                        <Option value="amounts">Financial Amounts</Option>
                        <Option value="issues">Validation Issues</Option>
                      </Select>
                    </Form.Item>
                    <Button type="primary">Save Settings</Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>

      {/* Claim Details Drawer */}
      <Drawer
        title="Claim Details"
        placement="right"
        width={500}
        onClose={() => setDetailsDrawerVisible(false)}
        open={detailsDrawerVisible}
      >
        {selectedClaim && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">Claim ID</Text>
                  <div><Text code>{selectedClaim.claimId}</Text></div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Status</Text>
                  <div>
                    <Tag color={selectedClaim.status === 'valid' ? 'green' : 'red'}>
                      {selectedClaim.status?.toUpperCase()}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>Patient Information</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">Name</Text>
                  <div>{selectedClaim.patientName || 'N/A'}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">NHIS Number</Text>
                  <div>{selectedClaim.nhisNumber || 'N/A'}</div>
                </Col>
              </Row>
            </Card>

            <Card size="small" style={{ marginBottom: 16 }}>
              <Text strong>Financial Summary</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">Total Amount</Text>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedClaim.amount)}
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Services Count</Text>
                  <div>{selectedClaim.serviceCount}</div>
                </Col>
              </Row>
            </Card>

            {selectedClaim.issues?.length > 0 && (
              <Card size="small">
                <Text strong>Validation Issues</Text>
                <Divider style={{ margin: '8px 0' }} />
                <List
                  size="small"
                  dataSource={selectedClaim.issues}
                  renderItem={(issue) => (
                    <List.Item>
                      <Space>
                        <WarningOutlined style={{ color: '#fa8c16' }} />
                        <Text>{issue}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* Add Mapping Modal */}
      <Modal
        title="Add Code Mapping"
        open={mappingModalVisible}
        onCancel={() => setMappingModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Local Code" required>
            <Input placeholder="Enter local code" />
          </Form.Item>
          <Form.Item label="NHIA Code" required>
            <Input placeholder="Enter NHIA code" />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>
          <Form.Item label="Category">
            <Select placeholder="Select category">
              <Option value="diagnosis">Diagnosis (ICD-10)</Option>
              <Option value="procedure">Procedure</Option>
              <Option value="medication">Medication</Option>
              <Option value="service">Service</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setMappingModalVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={() => { message.success('Mapping added'); setMappingModalVisible(false); }}>
                Add Mapping
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Export Modal */}
      <Modal
        title="Export Claims Data"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
      >
        <div style={{ padding: '16px 0' }}>
          <Text>Select export format:</Text>
          <Radio.Group 
            value={selectedExportFormat} 
            onChange={(e) => setSelectedExportFormat(e.target.value)}
            style={{ display: 'block', marginTop: 12 }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="csv">
                <Space>
                  <FileExcelOutlined />
                  <span>CSV (Comma Separated Values)</span>
                </Space>
              </Radio>
              <Radio value="json">
                <Space>
                  <FileTextOutlined />
                  <span>JSON (JavaScript Object Notation)</span>
                </Space>
              </Radio>
              <Radio value="xml">
                <Space>
                  <FileOutlined />
                  <span>XML (NHIA Format)</span>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </div>
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setExportModalVisible(false)}>Cancel</Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => performExport(selectedExportFormat)}
            >
              Export
            </Button>
          </Space>
        </div>
      </Modal>

      {/* Edit Claim Modal */}
      <Modal
        title="Edit Failed Claim"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); setEditingClaim(null); }}
        width={700}
        footer={null}
      >
        {editingClaim && (
          <Form 
            layout="vertical"
            initialValues={editingClaim}
            onFinish={handleSaveEditedClaim}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Claim ID" name="claimId">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Patient Name" name="memberName">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="NHIS Number" name="nhisNumber">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Diagnosis Code" name="diagnosisCode">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Services">
              {editingClaim.services?.map((service, idx) => (
                <Card key={idx} size="small" style={{ marginBottom: 8 }}>
                  <Row gutter={12}>
                    <Col span={8}>
                      <Text strong>Code:</Text> {service.serviceCode}
                    </Col>
                    <Col span={8}>
                      <Text strong>Description:</Text> {service.description}
                    </Col>
                    <Col span={8}>
                      <Tag color={service.validation?.isValid ? 'green' : 'red'}>
                        {service.validation?.isValid ? 'Valid' : 'Invalid'}
                      </Tag>
                    </Col>
                  </Row>
                  {!service.validation?.isValid && service.validation?.issues && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">Issues: </Text>
                      {service.validation.issues.map((issue, i) => (
                        <Tag key={i} color="red">{issue}</Tag>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => { setEditModalVisible(false); setEditingClaim(null); }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Save Changes
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <style>{`
        .vetting-erp-module {
          padding: 0;
          background: #f0f2f5;
          min-height: 100vh;
        }

        .vetting-erp-header {
          background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
          padding: 24px;
          margin-bottom: 24px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon-bg {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 12px;
        }

        .header-icon {
          font-size: 28px;
          color: white;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .header-actions .ant-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .header-actions .ant-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          color: white;
        }

        .header-actions .ant-btn-primary {
          background: white;
          color: #1890ff;
          border-color: white;
        }

        .kpi-cards {
          padding: 0 24px;
        }

        .kpi-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .total-card::before {
          background: linear-gradient(90deg, #1890ff, #69c0ff);
        }

        .total-services-card::before {
          background: linear-gradient(90deg, #13c2c2, #36cfc9);
        }

        .passed-card::before {
          background: linear-gradient(90deg, #52c41a, #95de64);
        }

        .failed-card::before {
          background: linear-gradient(90deg, #ff4d4f, #ff7875);
        }

        .progress-card {
          margin: 16px 24px;
          border-radius: 12px;
        }

        .quick-actions-card {
          border-radius: 12px;
        }

        .quick-action-btn {
          height: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          border-radius: 8px;
        }

        .quick-action-btn .anticon {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .kpi-cards,
          .progress-card,
          .quick-actions-card {
            padding: 0 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default NHIAVettingModule;

