// Accounts ERP Dashboard - Professional Hospital Accounting System
import React, { useEffect, useState, useCallback } from "react";
import {
  Row, Col, Card, Statistic, Table, Tag, Button,
  Space, Progress, Typography, Spin, message, Badge,
  Tabs, Select, Divider, Drawer, Segmented
} from "antd";
import {
  DollarOutlined, FileTextOutlined, SyncOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  WarningOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined,
  RightOutlined, BankOutlined, WalletOutlined,
  InsuranceOutlined, CreditCardOutlined, RiseOutlined, FallOutlined,
  PrinterOutlined, DownloadOutlined, PlusOutlined,
  EyeOutlined, HistoryOutlined, SafetyOutlined, CalendarOutlined, FundOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import apiClient from "../../../redux/middleware/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;


// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AccountsErpDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get institution from Redux
  const user = useSelector((state) => state.auth.user || state.auth.admin);
  const institutionId = user.institution.id;
  
  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [patientType, setPatientType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);

  // Data states - Real data from backend
  const [billingStats, setBillingStats] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [outstandingBills, setOutstandingBills] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [todayCollection, setTodayCollection] = useState(0);
  const [departmentRevenue, setDepartmentRevenue] = useState([]);

  // Fetch data from backend
  const fetchDashboardData = useCallback(async () => {
    if (!institutionId) {
      console.log('No institution ID found');
      return;
    }

    setLoading(true);
    try {
      // Fetch billing statistics
      const billingStatsRes = await apiClient.get(
        `/invoice/billing/stats`,
        {
          params: { institution_id: institutionId },
          headers: getAuthHeader()
        }
      );

      if (billingStatsRes.data?.success) {
        setBillingStats(billingStatsRes.data.data);
      }

      // Fetch recent transactions (invoices)
      const recentInvoicesRes = await apiClient.get(
        `/invoice/billing/recent-transactions`,
        {
          params: { institution_id: institutionId, limit: 10 },
          headers: getAuthHeader()
        }
      );

      if (recentInvoicesRes.data?.success) {
        setRecentInvoices(recentInvoicesRes.data.data || []);
      }

      // Fetch payment statistics
      const paymentStatsRes = await apiClient.get(
        `/payment/stats/summary`,
        {
          params: { institution_id: institutionId },
          headers: getAuthHeader()
        }
      );

      if (paymentStatsRes.data?.success) {
        setRecentPayments(paymentStatsRes.data.data || []);
      }

      // Fetch billing statistics for monthly revenue
      const detailedStatsRes = await apiClient.get(
        `/bills/statistics`,
        {
          params: { institution_id: institutionId, time_range: 'monthly' },
          headers: getAuthHeader()
        }
      );

      if (detailedStatsRes.data?.current_period) {
        setMonthlyRevenue(detailedStatsRes.data.current_period?.month?.revenue || 0);
        setTodayCollection(detailedStatsRes.data.current_period?.day?.revenue || 0);
      }

      if (detailedStatsRes.data?.department_stats?.by_revenue) {
        setDepartmentRevenue(detailedStatsRes.data.department_stats.by_revenue.slice(0, 6));
      }

      // Get outstanding bills from billing stats
      if (billingStatsRes.data?.data?.pending_invoices > 0) {
        const outstanding = (recentInvoicesRes.data.data || [])
          .filter(inv => inv.status === 'unpaid' || inv.status === 'partially_paid')
          .map((inv, idx) => ({
            id: inv.id || idx,
            patient: inv.visit?.patient ? `${inv.visit.patient.first_name} ${inv.visit.patient.last_name}` : 'Unknown',
            nhisNumber: inv.visit?.patient?.nhis_number || 'N/A',
            amount: inv.balance_due || inv.total_amount - (inv.amount_paid || 0),
            daysOverdue: inv.due_date ? dayjs().diff(dayjs(inv.due_date), 'day') : 0,
            type: inv.payment_method === 'insurance' ? 'Insured' : 'Self-Pay'
          }));
        setOutstandingBills(outstanding);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  // Initial data load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'GHS 0.00';
    const num = parseFloat(value);
    if (isNaN(num)) return 'GHS 0.00';
    if (num >= 1000000) {
      return `GHS ${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `GHS ${(num / 1000).toFixed(1)}K`;
    }
    return `GHS ${num.toFixed(2)}`;
  };

  // Quick navigation handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'newInvoice':
        navigate('/shared/accounts/create-invoice');
        break;
      case 'recordPayment':
        navigate('/shared/accounts/record-payment');
        break;
      case 'invoices':
        navigate('/shared/accounts/invoices');
        break;
      case 'payments':
        navigate('/shared/accounts/payment-history');
        break;
      case 'insured':
        navigate('/shared/accounts/insured-patients');
        break;
      case 'selfpay':
        navigate('/shared/accounts/selfpay-patients');
        break;
      case 'reports':
        navigate('/shared/accounts/revenue-report');
        break;
      case 'reconciliation':
        navigate('/shared/accounts/bank-reconciliation');
        break;
      default:
        break;
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    message.success('Dashboard refreshed');
  };

  // Handle view invoice details
  const handleViewInvoice = (record) => {
    setSelectedInvoice(record);
    setDetailsDrawerVisible(true);
  };

  // Status colors
  const statusColors = {
    paid: 'success',
    pending: 'processing',
    overdue: 'error',
    partial: 'warning',
    draft: 'default',
    unpaid: 'warning',
    partially_paid: 'processing',
    cancelled: 'red',
    refunded: 'red'
  };

  // Get stats values
  const stats = billingStats || {
    total_revenue: 0,
    paid_amount: 0,
    pending_amount: 0,
    pending_invoices: 0,
    overdue_invoices: 0,
    overdue_amount: 0
  };

  // Calculate insured vs self-pay from payment methods
  const paymentMethods = billingStats?.payment_methods || [];
  const insuredRevenue = paymentMethods
    .filter(pm => pm.payment_method === 'insurance')
    .reduce((sum, pm) => sum + parseFloat(pm.total_amount || 0), 0);
  const selfPayRevenue = paymentMethods
    .filter(pm => pm.payment_method !== 'insurance')
    .reduce((sum, pm) => sum + parseFloat(pm.total_amount || 0), 0);
  
  // Use revenue_by_patient_type from backend (based on Patient.has_insurance)
  const revenueByPatientType = billingStats?.revenue_by_patient_type || { insured: 0, self_pay: 0, total: 0 };
  const insuredRevenueFromPatientType = revenueByPatientType.insured || insuredRevenue;
  const selfPayRevenueFromPatientType = revenueByPatientType.self_pay || selfPayRevenue;
  const totalPaymentRevenue = revenueByPatientType.total || (insuredRevenueFromPatientType + selfPayRevenueFromPatientType);

  // Invoice columns
  const invoiceColumns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
      render: (ref) => <Text code className="text-xs">{ref || 'N/A'}</Text>,
    },
    {
      title: 'Patient',
      dataIndex: ['visit', 'patient'],
      key: 'patient',
      render: (patient, record) => {
        // Determine patient type based on patient's has_insurance field, fallback to payment_method
        const isInsured = patient?.has_insurance === true || record.payment_method === 'insurance';
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown'}</Text>
            <Tag color={isInsured ? 'blue' : 'orange'} className="text-xs">
              {isInsured ? 'Insured' : 'Self-Pay'}
            </Tag>
          </Space>
        );
      }
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'amount',
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
      align: 'right',
    },
    {
      title: 'Paid',
      dataIndex: 'amount_paid',
      key: 'paid',
      render: (paid) => <Text className="text-green-600">{formatCurrency(paid)}</Text>,
      align: 'right',
    },
    {
      title: 'Balance',
      dataIndex: 'balance_due',
      key: 'balance',
      render: (balance) => <Text className="text-orange-600">{formatCurrency(balance)}</Text>,
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>{status?.replace('_', ' ').toUpperCase() || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'invoice_date',
      key: 'date',
      render: (date) => date ? dayjs(date).format('DD/MM/YY') : 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewInvoice(record)}
          size="small"
        >
          View
        </Button>
      ),
    },
  ];

  // Outstanding patients columns
  const outstandingColumns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.nhisNumber}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Insured' ? 'blue' : 'orange'}>{type}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong className="text-red-500">{formatCurrency(amount)}</Text>,
      align: 'right',
    },
    {
      title: 'Days Overdue',
      dataIndex: 'daysOverdue',
      key: 'daysOverdue',
      render: (days) => (
        <Badge 
          count={days} 
          style={{ backgroundColor: days > 10 ? '#ff4d4f' : days > 5 ? '#faad14' : '#52c41a' }} 
        />
      ),
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">Follow Up</Button>
      ),
    },
  ];

  return (
    <div className="accounts-dashboard">
      {/* Header Section */}
      <div className="accounts-dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon-bg">
              <DollarOutlined className="header-icon" />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>Accounts Management ERP</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                Hospital Financial Management | {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </div>
          </div>
          <div className="header-actions">
            <Segmented
              options={[
                { label: 'All', value: 'all' },
                { label: 'Insured', value: 'insured' },
                { label: 'Self-Pay', value: 'selfpay' },
              ]}
              value={patientType}
              onChange={setPatientType}
              className="bg-white/20"
            />
            <Button
              icon={<SyncOutlined spin={loading} />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleQuickAction('newInvoice')}
            >
              New Invoice
            </Button>
          </div>
        </div>
      </div>

      {loading && !billingStats ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Loading financial data...</div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <Row gutter={[16, 16]} className="kpi-cards">
            <Col xs={24} sm={12} lg={6}>
              <Card className="kpi-card total-revenue-card">
                <Statistic
                  title={<span style={{ color: '#8c8c8c' }}>Total Revenue</span>}
                  value={stats.total_revenue || 0}
                  formatter={(val) => formatCurrency(val)}
                  prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>All time revenue</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="kpi-card monthly-revenue-card">
                <Statistic
                  title={<span style={{ color: '#8c8c8c' }}>Monthly Revenue</span>}
                  value={monthlyRevenue}
                  formatter={(val) => formatCurrency(val)}
                  prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>This month</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="kpi-card pending-payments-card">
                <Statistic
                  title={<span style={{ color: '#8c8c8c' }}>Pending Payments</span>}
                  value={stats.pending_amount || 0}
                  formatter={(val) => formatCurrency(val)}
                  prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
                  valueStyle={{ color: '#fa8c16' }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>{stats.pending_invoices || 0} invoices</Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="kpi-card today-collection-card">
                <Statistic
                  title={<span style={{ color: '#8c8c8c' }}>Today's Collection</span>}
                  value={todayCollection}
                  formatter={(val) => formatCurrency(val)}
                  prefix={<FundOutlined style={{ color: '#722ed1' }} />}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>Daily collections</Text>
              </Card>
            </Col>
          </Row>

          {/* Secondary Stats Row - Patient Type Breakdown */}
          <Row gutter={[16, 16]} className="secondary-stats">
            <Col xs={12} sm={6}>
              <Card size="small" className="mini-stat-card insured-card">
                <div className="mini-stat-content">
                  <div className="mini-stat-icon">
                    <InsuranceOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  </div>
                  <div className="mini-stat-info">
                    <Text type="secondary" style={{ fontSize: 12 }}>Insured Revenue</Text>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      {formatCurrency(insuredRevenueFromPatientType)}
                    </Title>
                  </div>
                </div>
                <Progress 
                  percent={totalPaymentRevenue > 0 ? Math.round((insuredRevenue / totalPaymentRevenue) * 100) : 0} 
                  showInfo={false} 
                  strokeColor="#1890ff" 
                  size="small" 
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" className="mini-stat-card selfpay-card">
                <div className="mini-stat-content">
                  <div className="mini-stat-icon">
                    <WalletOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                  </div>
                  <div className="mini-stat-info">
                    <Text type="secondary" style={{ fontSize: 12 }}>Self-Pay Revenue</Text>
                    <Title level={4} style={{ margin: 0, color: '#fa8c16' }}>
                      {formatCurrency(selfPayRevenueFromPatientType)}
                    </Title>
                  </div>
                </div>
                <Progress 
                  percent={totalPaymentRevenue > 0 ? Math.round((selfPayRevenue / totalPaymentRevenue) * 100) : 0} 
                  showInfo={false} 
                  strokeColor="#fa8c16" 
                  size="small" 
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" className="mini-stat-card paid-card">
                <Statistic
                  title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Paid Amount</span>}
                  value={stats.paid_amount || 0}
                  formatter={(val) => formatCurrency(val)}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ fontSize: 20, fontWeight: 600 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" className="mini-stat-card overdue-card">
                <Statistic
                  title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Overdue</span>}
                  value={stats.overdue_invoices || 0}
                  prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                  valueStyle={{ fontSize: 20, fontWeight: 600, color: '#ff4d4f' }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>{formatCurrency(stats.overdue_amount || 0)}</Text>
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
                  onClick={() => handleQuickAction('newInvoice')}
                  block
                  className="quick-action-btn"
                >
                  New Invoice
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  type="primary"
                  icon={<CreditCardOutlined />}
                  onClick={() => handleQuickAction('recordPayment')}
                  block
                  className="quick-action-btn"
                >
                  Record Payment
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => handleQuickAction('invoices')}
                  block
                  className="quick-action-btn"
                >
                  All Invoices
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() => handleQuickAction('payments')}
                  block
                  className="quick-action-btn"
                >
                  Payments
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  icon={<InsuranceOutlined />}
                  onClick={() => handleQuickAction('insured')}
                  block
                  className="quick-action-btn"
                >
                  Insured
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  icon={<WalletOutlined />}
                  onClick={() => handleQuickAction('selfpay')}
                  block
                  className="quick-action-btn"
                >
                  Self-Pay
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  icon={<BarChartOutlined />}
                  onClick={() => handleQuickAction('reports')}
                  block
                  className="quick-action-btn"
                >
                  Reports
                </Button>
              </Col>
              <Col xs={12} sm={8} md={3}>
                <Button
                  icon={<SafetyOutlined />}
                  onClick={() => handleQuickAction('reconciliation')}
                  block
                  className="quick-action-btn"
                >
                  Reconciliation
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Main Content */}
          <div style={{ padding: '0 24px 24px' }}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={<span><BarChartOutlined /> Overview</span>} key="overview">
                <Row gutter={[16, 16]}>
                  {/* Revenue by Patient Type */}
                  <Col xs={24} lg={12}>
                    <Card title={<Space><PieChartOutlined /> Revenue by Patient Type</Space>}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <div className="revenue-type-item">
                            <Progress
                              type="circle"
                              percent={totalPaymentRevenue > 0 ? Math.round((insuredRevenueFromPatientType / totalPaymentRevenue) * 100) : 0}
                              strokeColor="#1890ff"
                              size={100}
                              format={() => (
                                <>
                                  <InsuranceOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                  <div style={{ fontSize: 12 }}>{totalPaymentRevenue > 0 ? Math.round((insuredRevenueFromPatientType / totalPaymentRevenue) * 100) : 0}%</div>
                                </>
                              )}
                            />
                            <Text strong>Insured (NHIS)</Text>
                            <Text type="secondary">{formatCurrency(insuredRevenueFromPatientType)}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="revenue-type-item">
                            <Progress
                              type="circle"
                              percent={totalPaymentRevenue > 0 ? Math.round((selfPayRevenueFromPatientType / totalPaymentRevenue) * 100) : 0}
                              strokeColor="#fa8c16"
                              size={100}
                              format={() => (
                                <>
                                  <WalletOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                                  <div style={{ fontSize: 12 }}>{totalPaymentRevenue > 0 ? Math.round((selfPayRevenueFromPatientType / totalPaymentRevenue) * 100) : 0}%</div>
                                </>
                              )}
                            />
                            <Text strong>Self-Pay</Text>
                            <Text type="secondary">{formatCurrency(selfPayRevenueFromPatientType)}</Text>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  {/* Revenue by Department */}
                  <Col xs={24} lg={12}>
                    <Card title={<Space><BarChartOutlined /> Revenue by Department</Space>}>
                      <div className="department-revenue-list">
                        {departmentRevenue.length > 0 ? (
                          departmentRevenue.map((dept, index) => (
                            <div key={index} className="department-revenue-item">
                              <div className="dept-info">
                                <Text strong>{dept.name || 'Unknown'}</Text>
                                <Text type="secondary">{formatCurrency(dept.revenue)}</Text>
                              </div>
                              <div className="dept-progress">
                                <Progress 
                                  percent={stats.total_revenue > 0 ? Math.round((dept.revenue / stats.total_revenue) * 100) : 0} 
                                  showInfo={false}
                                  strokeColor={index === 0 ? '#1890ff' : index === 1 ? '#52c41a' : '#722ed1'}
                                  size="small"
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                            No department data available
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>

                  {/* Recent Invoices */}
                  <Col span={24}>
                    <Card 
                      title={<Space><FileTextOutlined /> Recent Invoices</Space>}
                      extra={
                        <Button type="link" onClick={() => navigate('/shared/accounts/invoices')}>
                          View All <RightOutlined />
                        </Button>
                      }
                    >
                      <Table
                        dataSource={recentInvoices}
                        columns={invoiceColumns}
                        pagination={false}
                        size="small"
                        rowKey="id"
                        loading={loading}
                        locale={{ emptyText: 'No invoices found' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={<span><WarningOutlined /> Outstanding Bills</span>} key="outstanding">
                <Card>
                  <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col xs={24} md={8}>
                      <Select
                        placeholder="Filter by type"
                        className="w-full"
                        style={{ width: '100%' }}
                      >
                        <Option value="all">All Types</Option>
                        <Option value="insured">Insured</Option>
                        <Option value="selfpay">Self-Pay</Option>
                      </Select>
                    </Col>
                    <Col xs={24} md={8}>
                      <Button icon={<DownloadOutlined />}>Export Outstanding</Button>
                    </Col>
                  </Row>

                  <Table
                    dataSource={outstandingBills}
                    columns={outstandingColumns}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: 'No outstanding bills' }}
                  />
                </Card>
              </TabPane>

              <TabPane tab={<span><LineChartOutlined /> Financial Reports</span>} key="reports">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Card hoverable onClick={() => handleQuickAction('reports')}>
                      <div className="report-card">
                        <RiseOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                        <Text strong>Revenue Report</Text>
                        <Text type="secondary">View revenue analytics</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card hoverable>
                      <div className="report-card">
                        <FallOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                        <Text strong>Expense Report</Text>
                        <Text type="secondary">Track expenses</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card hoverable>
                      <div className="report-card">
                        <CalendarOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                        <Text strong>Daily Collection</Text>
                        <Text type="secondary">Daily summary</Text>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>

          {/* Invoice Details Drawer */}
          <Drawer
            title="Invoice Details"
            placement="right"
            width={500}
            onClose={() => setDetailsDrawerVisible(false)}
            open={detailsDrawerVisible}
          >
            {selectedInvoice && (
              <div className="invoice-details">
                <Card size="small">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text type="secondary">Invoice Number</Text>
                      <div className="font-mono">{selectedInvoice.invoice_number || 'N/A'}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Status</Text>
                      <div>
                        <Tag color={statusColors[selectedInvoice.status]}>
                          {selectedInvoice.status?.replace('_', ' ').toUpperCase() || 'N/A'}
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </Card>

                <Divider orientation="left">Patient Information</Divider>
                <Card size="small">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text type="secondary">Patient Name</Text>
                      <div>{selectedInvoice.visit?.patient ? `${selectedInvoice.visit.patient.first_name} ${selectedInvoice.visit.patient.last_name}` : 'Unknown'}</div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Payment Type</Text>
                      <div>
                        <Tag color={selectedInvoice.visit?.patient?.has_insurance === true || selectedInvoice.payment_method === 'insurance' ? 'blue' : 'orange'}>
                          {selectedInvoice.visit?.patient?.has_insurance === true || selectedInvoice.payment_method === 'insurance' ? 'Insured' : 'Self-Pay'}
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </Card>

                <Divider orientation="left">Financial Summary</Divider>
                <Card size="small">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text type="secondary">Total Amount</Text>
                      <div className="text-xl font-bold">
                        {formatCurrency(selectedInvoice.total_amount)}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Amount Paid</Text>
                      <div className="text-green-600">
                        {formatCurrency(selectedInvoice.amount_paid)}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Balance Due</Text>
                      <div className="text-orange-600">
                        {formatCurrency(selectedInvoice.balance_due)}
                      </div>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Invoice Date</Text>
                      <div>{selectedInvoice.invoice_date ? dayjs(selectedInvoice.invoice_date).format('DD/MM/YYYY') : 'N/A'}</div>
                    </Col>
                  </Row>
                </Card>

                <Divider />
                <Space style={{ width: '100%' }} direction="vertical">
                  {selectedInvoice.status !== 'paid' && (
                    <Button 
                      type="primary" 
                      icon={<CreditCardOutlined />} 
                      block
                      onClick={() => navigate('/shared/accounts/record-payment')}
                    >
                      Record Payment
                    </Button>
                  )}
                  <Button icon={<PrinterOutlined />} block>
                    Print Invoice
                  </Button>
                  <Button icon={<DownloadOutlined />} block>
                    Download PDF
                  </Button>
                </Space>
              </div>
            )}
          </Drawer>
        </>
      )}

      <style>{`
        .accounts-dashboard {
          padding: 0;
          background: #f0f2f5;
          min-height: 100vh;
        }
        .accounts-dashboard-header {
          background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
          padding: 24px;
          margin-bottom: 24px;
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
          align-items: center;
        }
        .kpi-cards {
          padding: 0 24px;
        }
        .kpi-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .secondary-stats {
          padding: 0 24px;
          margin-top: 16px;
        }
        .mini-stat-card {
          border-radius: 8px;
        }
        .mini-stat-content {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
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
        }
        .revenue-type-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
        }
        .department-revenue-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .department-revenue-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dept-info {
          width: 140px;
        }
        .report-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px;
        }
        .text-xs { font-size: 12px; }
        .text-green-600 { color: #52c41a; }
        .text-red-500 { color: #ff4d4f; }
        .text-orange-600 { color: #fa8c16; }
      `}</style>
    </div>
  );
};

export default AccountsErpDashboard;

