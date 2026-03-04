// Claims ERP Dashboard - Professional ERP Dashboard
import React, { useEffect, useState, useCallback } from "react";
import {
  Row, Col, Card, Statistic, Table, Tag, Button,
  Space, Progress, Typography, Spin, message, Badge, List, Avatar,
  Tabs, DatePicker, Select, Upload, Alert, Divider, Drawer
} from "antd";
import {
  DollarOutlined, FileTextOutlined, SyncOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  WarningOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined,
  RightOutlined, UploadOutlined, DownloadOutlined, SearchOutlined,
  FilterOutlined, PlusOutlined, EditOutlined, EyeOutlined,
  BankOutlined, MedicineBoxOutlined, ExperimentOutlined, 
  ProfileOutlined, NodeIndexOutlined, ToolOutlined, HistoryOutlined,
  FileExcelOutlined, FilePdfOutlined, CheckSquareOutlined,
  ExclamationCircleOutlined, SendOutlined, AuditOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import {
  fetchClaimSummary,
  fetchRecentClaims,
  fetchClaimItemsBreakdown
} from "../../../redux/slice/claimItemSlice";
import {
  fetchAllClaims,
  updateClaimStatus
} from "../../../redux/slice/claimsSlice";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const ClaimsErpDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state - using both slices
  const claimItemState = useSelector((state) => state.claimItem);
  const claimsState = useSelector((state) => state.claims);

  // Destructure from claimItem slice (for dashboard data)
  const { 
    summary, 
    recentClaims, 
    itemsBreakdown, 
    loading: claimItemLoading
  } = claimItemState;

  // Destructure from claims slice (for claims list)
  const { 
    claims, 
    pagination 
  } = claimsState;

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [claimStats, setClaimStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    submittedClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = useCallback(() => {
    dispatch(fetchClaimSummary())
      .unwrap()
      .catch((err) => console.error('Failed to load summary:', err));

    dispatch(fetchRecentClaims())
      .unwrap()
      .catch((err) => console.error('Failed to load recent claims:', err));

    dispatch(fetchClaimItemsBreakdown())
      .unwrap()
      .catch((err) => console.error('Failed to load items breakdown:', err));
      
    dispatch(fetchAllClaims({ 
      page: 1, 
      limit: 10, 
      status: statusFilter !== 'all' ? statusFilter : undefined 
    })).catch((err) => console.error('Failed to load claims:', err));
  }, [dispatch, statusFilter]);

  // Update stats from summary
  useEffect(() => {
    if (summary) {
      setClaimStats({
        totalClaims: summary.totalClaims || 0,
        pendingClaims: summary.statusBreakdown?.pending || 0,
        submittedClaims: summary.statusBreakdown?.submitted || 0,
        approvedClaims: summary.statusBreakdown?.approved || 0,
        rejectedClaims: summary.statusBreakdown?.rejected || 0,
        totalAmount: summary.totalAmount || 0,
        approvedAmount: summary.statusBreakdown?.approved * (summary.totalAmount / (summary.totalClaims || 1)),
        pendingAmount: summary.statusBreakdown?.pending * (summary.totalAmount / (summary.totalClaims || 1))
      });
    }
  }, [summary]);

  const handleRefresh = () => {
    loadDashboardData();
    message.success('Dashboard refreshed');
  };

  // Quick navigation handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'claimsList':
        navigate('/shared/claims/patient-claims-desk');
        break;
      case 'medications':
        navigate('/shared/claims/medications');
        break;
      case 'diagnosis':
        navigate('/shared/claims/diagnosis');
        break;
      case 'mappings':
        navigate('/shared/claims/mappings');
        break;
      case 'gdrg':
        navigate('/shared/claims/dgrg-codes');
        break;
      case 'labTariffs':
        navigate('/shared/claims/lab-tarrifs');
        break;
      case 'vetting':
        navigate('/shared/claims/vetting');
        break;
      case 'export':
        navigate('/shared/claims/export');
        break;
      case 'history':
        navigate('/shared/claims/history');
        break;
      default:
        break;
    }
  };

  // Handle view claim details
  const handleViewDetails = (record) => {
    setSelectedClaim(record);
    setDetailsDrawerVisible(true);
  };

  // Handle claim status update
  const handleUpdateStatus = async (claimId, newStatus) => {
    try {
      await dispatch(updateClaimStatus({ claim_id: claimId, claim_status: newStatus })).unwrap();
      message.success(`Claim ${newStatus.toLowerCase()} successfully`);
      setDetailsDrawerVisible(false);
      loadDashboardData();
    } catch (error) {
      message.error('Failed to update claim status');
    }
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
    return `GHS ${num.toFixed(2)}}`;
  };

  // Status colors
  const statusColors = {
    Pending: 'blue',
    Submitted: 'orange',
    Approved: 'green',
    Rejected: 'red'
  };

  // Recent claims columns
  const recentClaimsColumns = [
    {
      title: 'Claim Ref',
      dataIndex: 'claim_reference_number',
      key: 'claim_reference_number',
      render: (ref) => <Text code>{ref?.slice(0, 12)}...</Text>,
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Text>
          {record.visit?.patient?.first_name} {record.visit?.patient?.last_name}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'claim_status',
      key: 'claim_status',
      render: (status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YY'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetails(record)}
        >
          View
        </Button>
      ),
    },
  ];

  // All claims columns
  const claimsColumns = [
    {
      title: 'Claim Ref',
      dataIndex: 'claim_reference_number',
      key: 'claim_reference_number',
      render: (ref, record) => <Text code>{ref || record.id?.slice(0, 8)}</Text>,
      width: 150,
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>
            {record.visit?.patient?.first_name} {record.visit?.patient?.last_name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.visit?.patient?.nhis_number}
          </Text>
        </Space>
      ),
      width: 200,
    },
    {
      title: 'Service Date',
      dataIndex: ['visit', 'visit_date'],
      key: 'serviceDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
      width: 120,
    },
    {
      title: 'Service Type',
      dataIndex: ['visit', 'visit_type'],
      key: 'serviceType',
      render: (type) => <Tag>{type || 'N/A'}</Tag>,
      width: 120,
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
      align: 'right',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'claim_status',
      key: 'claim_status',
      render: (status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
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
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetails(record)}
            size="small"
          />
        </Space>
      ),
      width: 80,
    },
  ];

  // Handle pagination
  const handleTableChange = (page, pageSize) => {
    dispatch(fetchAllClaims({ 
      page, 
      limit: pageSize, 
      status: statusFilter !== 'all' ? statusFilter : undefined 
    }));
  };

  // Calculate approval rate
  const approvalRate = claimStats.totalClaims > 0 
    ? ((claimStats.approvedClaims / claimStats.totalClaims) * 100).toFixed(1)
    : 0;

  return (
    <div className="claims-dashboard">
      {/* Header Section */}
      <div className="claims-dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon-bg">
              <BankOutlined className="header-icon" />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>Claims Management ERP</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Ghana NHIS Claims Dashboard | {new Date().toLocaleDateString('en-US', {
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
              icon={<SyncOutlined />}
              onClick={handleRefresh}
              loading={claimItemLoading}
            >
              Refresh
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/shared/claims/patient-claims-desk')}
            >
              New Claim
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="kpi-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card total-claims-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Claims</span>}
              value={claimStats.totalClaims}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>All time</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card pending-claims-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Pending</span>}
              value={claimStats.pendingClaims}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Awaiting review</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card approved-claims-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Approved</span>}
              value={claimStats.approvedClaims}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Approval rate: {approvalRate}%</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card total-value-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Value</span>}
              value={claimStats.totalAmount}
              formatter={(val) => formatCurrency(val)}
              prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>All claims value</Text>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats Row */}
      <Row gutter={[16, 16]} className="secondary-stats">
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Submitted</span>}
              value={claimStats.submittedClaims}
              prefix={<SendOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Rejected</span>}
              value={claimStats.rejectedClaims}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600, color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Approved Value</span>}
              value={claimStats.approvedAmount}
              formatter={(val) => formatCurrency(val)}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Pending Value</span>}
              value={claimStats.pendingAmount}
              formatter={(val) => formatCurrency(val)}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="quick-actions-card" title="Quick Actions" style={{ margin: '16px 24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={3}>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => handleQuickAction('claimsList')}
              block
              className="quick-action-btn"
            >
              Claims List
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              type="primary"
              icon={<MedicineBoxOutlined />}
              onClick={() => handleQuickAction('medications')}
              block
              className="quick-action-btn"
            >
              Medications
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<ProfileOutlined />}
              onClick={() => handleQuickAction('diagnosis')}
              block
              className="quick-action-btn"
            >
              ICD-10
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<NodeIndexOutlined />}
              onClick={() => handleQuickAction('mappings')}
              block
              className="quick-action-btn"
            >
              G-DRG Maps
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<ToolOutlined />}
              onClick={() => handleQuickAction('gdrg')}
              block
              className="quick-action-btn"
            >
              GDRG Codes
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<ExperimentOutlined />}
              onClick={() => handleQuickAction('labTariffs')}
              block
              className="quick-action-btn"
            >
              Lab Tariffs
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<AuditOutlined />}
              onClick={() => handleQuickAction('vetting')}
              block
              className="quick-action-btn"
            >
              Vetting
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleQuickAction('export')}
              block
              className="quick-action-btn"
            >
              Export
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <div style={{ padding: '0 24px 24px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><BarChartOutlined /> Overview</span>} key="overview">
            <Row gutter={[16, 16]}>
              {/* Claims Status Chart */}
              <Col xs={24} lg={12}>
                <Card title={<Space><PieChartOutlined /> Claims Status Distribution</Space>}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div className="status-item">
                        <Progress
                          type="circle"
                          percent={claimStats.totalClaims > 0 ? ((claimStats.pendingClaims / claimStats.totalClaims) * 100).toFixed(0) : 0}
                          strokeColor="#fa8c16"
                          size={80}
                        />
                        <Text>Pending</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="status-item">
                        <Progress
                          type="circle"
                          percent={claimStats.totalClaims > 0 ? ((claimStats.approvedClaims / claimStats.totalClaims) * 100).toFixed(0) : 0}
                          strokeColor="#52c41a"
                          size={80}
                        />
                        <Text>Approved</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="status-item">
                        <Progress
                          type="circle"
                          percent={claimStats.totalClaims > 0 ? ((claimStats.rejectedClaims / claimStats.totalClaims) * 100).toFixed(0) : 0}
                          strokeColor="#ff4d4f"
                          size={80}
                        />
                        <Text>Rejected</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Items Breakdown */}
              <Col xs={24} lg={12}>
                <Card title={<Space><BarChartOutlined /> Claims Items Breakdown</Space>}>
                  {itemsBreakdown && itemsBreakdown.length > 0 ? (
                    <div className="items-breakdown">
                      {itemsBreakdown.map((item, index) => (
                        <div key={index} className="breakdown-item">
                          <div className="breakdown-info">
                            <Text strong>{item.item_type}</Text>
                            <Text type="secondary">{item.count} items</Text>
                          </div>
                          <div className="breakdown-value">
                            <Text strong>{formatCurrency(item.totalAmount)}</Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 24 }}>
                      <FileTextOutlined style={{ fontSize: 32, color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                        No items breakdown available
                      </Text>
                    </div>
                  )}
                </Card>
              </Col>

              {/* Recent Claims */}
              <Col span={24}>
                <Card 
                  title={<Space><FileTextOutlined /> Recent Claims</Space>}
                  extra={
                    <Button type="link" onClick={() => navigate('/shared/claims/patient-claims-desk')}>
                      View All <RightOutlined />
                    </Button>
                  }
                >
                  <Table
                    dataSource={recentClaims || []}
                    columns={recentClaimsColumns}
                    pagination={false}
                    size="small"
                    rowKey="id"
                    loading={claimItemLoading}
                    locale={{ emptyText: 'No recent claims' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={<span><FileTextOutlined /> All Claims</span>} key="claims">
            <Card>
              {/* Filters */}
              <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} md={8}>
                  <Select
                    placeholder="Filter by status"
                    className="w-full"
                    value={statusFilter}
                    onChange={(value) => {
                      setStatusFilter(value);
                      dispatch(fetchAllClaims({ 
                        page: 1, 
                        limit: pagination.itemsPerPage, 
                        status: value !== 'all' ? value : undefined 
                      }));
                    }}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">All Statuses</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Submitted">Submitted</Option>
                    <Option value="Approved">Approved</Option>
                    <Option value="Rejected">Rejected</Option>
                  </Select>
                </Col>
                <Col xs={24} md={8}>
                  <RangePicker 
                    className="w-full"
                    onChange={(dates) => setDateRange(dates)}
                    format="DD/MM/YYYY"
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Space>
                    <Button icon={<FilterOutlined />}>Apply Filters</Button>
                    <Button icon={<DownloadOutlined />}>Export</Button>
                  </Space>
                </Col>
              </Row>

              {/* Claims Table */}
              <Table
                dataSource={claims || []}
                columns={claimsColumns}
                rowKey="id"
                loading={claimItemLoading}
                pagination={{
                  current: pagination.currentPage,
                  total: pagination.totalItems,
                  pageSize: pagination.itemsPerPage,
                  onChange: handleTableChange,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} claims`
                }}
                scroll={{ x: 1000 }}
              />
            </Card>
          </TabPane>

          <TabPane tab={<span><AuditOutlined /> Vetting Module</span>} key="vetting">
            <ClaimsVettingModule />
          </TabPane>
        </Tabs>
      </div>

      {/* Claim Details Drawer */}
      <Drawer
        title="Claim Details"
        placement="right"
        width={600}
        onClose={() => setDetailsDrawerVisible(false)}
        open={detailsDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDetailsDrawerVisible(false)}>Close</Button>
            {selectedClaim?.claim_status === 'Pending' && (
              <>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  className="bg-green-500"
                  onClick={() => handleUpdateStatus(selectedClaim.id, 'Approved')}
                >
                  Approve
                </Button>
                <Button 
                  danger 
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleUpdateStatus(selectedClaim.id, 'Rejected')}
                >
                  Reject
                </Button>
              </>
            )}
          </Space>
        }
      >
        {selectedClaim && (
          <div className="claim-details">
            <Card size="small" className="mb-4">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Claim Reference</Text>
                  <div className="font-mono">{selectedClaim.claim_reference_number || selectedClaim.id}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Status</Text>
                  <div>
                    <Tag color={statusColors[selectedClaim.claim_status]} className="mt-1">
                      {selectedClaim.claim_status?.toUpperCase()}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </Card>

            <Divider orientation="left">Patient Information</Divider>
            <Card size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Name</Text>
                  <div>
                    {selectedClaim.visit?.patient?.first_name} {selectedClaim.visit?.patient?.last_name}
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">NHIS Number</Text>
                  <div>{selectedClaim.visit?.patient?.nhis_number || 'N/A'}</div>
                </Col>
              </Row>
            </Card>

            <Divider orientation="left">Financial Summary</Divider>
            <Card size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Total Amount</Text>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedClaim.total_amount)}
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Submission Date</Text>
                  <div>
                    {selectedClaim.submission_date ? 
                      dayjs(selectedClaim.submission_date).format('DD/MM/YYYY') : 
                      'Not submitted'}
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Drawer>

      <style>{`
        .claims-dashboard {
          padding: 0;
          background: #f0f2f5;
          min-height: 100vh;
        }

        .claims-dashboard-header {
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

        .header-actions .ant-btn-primary:hover {
          background: #f0f0f0;
          color: #096dd9;
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

        .total-claims-card::before {
          background: linear-gradient(90deg, #1890ff, #69c0ff);
        }

        .pending-claims-card::before {
          background: linear-gradient(90deg, #fa8c16, #ffc069);
        }

        .approved-claims-card::before {
          background: linear-gradient(90deg, #52c41a, #95de64);
        }

        .total-value-card::before {
          background: linear-gradient(90deg, #722ed1, #b37feb);
        }

        .secondary-stats {
          padding: 0 24px;
          margin-top: 16px;
        }

        .mini-stat-card {
          border-radius: 8px;
          text-align: center;
        }

        .quick-actions-card {
          margin: 16px 24px;
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

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .items-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #fafafa;
          border-radius: 8px;
        }

        .breakdown-info {
          display: flex;
          flex-direction: column;
        }

        .breakdown-value {
          font-size: 16px;
        }

        .w-full {
          width: 100%;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .kpi-cards,
          .quick-actions-card,
          .secondary-stats {
            padding: 0 12px;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .kpi-card,
        .quick-actions-card {
          animation: fadeInUp 0.4s ease-out;
        }

        .kpi-card:nth-child(1) { animation-delay: 0.1s; }
        .kpi-card:nth-child(2) { animation-delay: 0.15s; }
        .kpi-card:nth-child(3) { animation-delay: 0.2s; }
        .kpi-card:nth-child(4) { animation-delay: 0.25s; }
      `}</style>
    </div>
  );
};

// Claims Vetting Module Component
const ClaimsVettingModule = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [vettingResults, setVettingResults] = useState(null);
  const [vettingLoading, setVettingLoading] = useState(false);

  const handleFileUpload = (info) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setUploadedFile(info.file.originFileObj);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleStartVetting = () => {
    if (!uploadedFile) {
      message.warning('Please upload an XML file first');
      return;
    }
    setVettingLoading(true);
    // Simulate vetting process
    setTimeout(() => {
      setVettingResults({
        totalClaims: 45,
        validClaims: 38,
        invalidClaims: 7,
        totalAmount: 125000,
        validatedAmount: 118000,
        issues: [
          { type: 'Invalid ICD Code', count: 3 },
          { type: 'Missing Price', count: 2 },
          { type: 'Invalid NHIS Number', count: 2 }
        ]
      });
      setVettingLoading(false);
      message.success('Vetting completed');
    }, 2000);
  };

  return (
    <div className="vetting-module">
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={<Space><AuditOutlined /> NHIA XML Claim Vetting</Space>}>
            <div className="vetting-upload-area">
              <Upload.Dragger
                name="file"
                accept=".xml"
                multiple={false}
                action="/api/v1/nhia-vetting/upload"
                onChange={handleFileUpload}
                beforeUpload={(file) => {
                  if (!file.name.endsWith('.xml')) {
                    message.error('Only XML files are allowed');
                    return Upload.LIST_IGNORE;
                  }
                  return false;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">Click or drag XML file to upload</p>
                <p className="ant-upload-text">Supports NHIA batch XML format</p>
              </Upload.Dragger>
            </div>

            {uploadedFile && (
              <Alert
                message="File Ready for Vetting"
                description={`${uploadedFile.name} is ready for processing`}
                type="success"
                showIcon
                style={{ marginTop: 16 }}
                action={
                  <Button 
                    type="primary" 
                    size="small"
                    loading={vettingLoading}
                    onClick={handleStartVetting}
                  >
                    Start Vetting
                  </Button>
                }
              />
            )}

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Instructions:</Text>
              <ul style={{ paddingLeft: 20 }}>
                <li>Upload NHIA-compliant XML batch file</li>
                <li>System will validate all claims against NHIA rules</li>
                <li>Review validation results before submission</li>
                <li>Export valid claims for NHIA submission</li>
              </ul>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<Space><CheckSquareOutlined /> Validation Rules</Space>}>
            <List
              size="small"
              dataSource={[
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
                  {item}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {vettingResults && (
          <Col span={24}>
            <Card title={<Space><AuditOutlined /> Vetting Results</Space>}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Claims"
                    value={vettingResults.totalClaims}
                    prefix={<FileTextOutlined />}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Valid Claims"
                    value={vettingResults.validClaims}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Invalid Claims"
                    value={vettingResults.invalidClaims}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Amount"
                    value={vettingResults.totalAmount}
                    prefix={<DollarOutlined />}
                    formatter={(val) => `GHS ${val.toLocaleString()}`}
                  />
                </Col>
              </Row>

              <Divider>Issues Found</Divider>
              <List
                size="small"
                dataSource={vettingResults.issues}
                renderItem={(issue) => (
                  <List.Item>
                    <Space>
                      <WarningOutlined style={{ color: '#fa8c16' }} />
                      <Text>{issue.type}</Text>
                      <Tag color="warning">{issue.count}</Tag>
                    </Space>
                  </List.Item>
                )}
              />

              <Divider />
              <Space>
                <Button type="primary" icon={<DownloadOutlined />}>
                  Export Valid Claims
                </Button>
                <Button icon={<FilePdfOutlined />}>
                  Download Report
                </Button>
              </Space>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ClaimsErpDashboard;

