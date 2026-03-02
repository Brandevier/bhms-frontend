// Store Dashboard - Professional ERP Dashboard
import React, { useEffect } from "react";
import {
  Row, Col, Card, Statistic, Table, Tag, Button,
  Space, Progress, Typography, Spin, message, Badge, List, Avatar
} from "antd";
import {
  ArrowUpOutlined, ArrowDownOutlined,
  AppstoreOutlined, ShoppingCartOutlined, WarningOutlined,
  TeamOutlined, DollarOutlined, SyncOutlined,
  FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, BarChartOutlined, PieChartOutlined,
  RightOutlined, InboxOutlined, SendOutlined, SwapOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { 
//   fetchStoreStatistics, 
//   fetchPendingRequests, 
//   fetchLowStockItems,
//   fetchStockAlerts,
//   fetchStockStatusReport,
//   fetchExpiredItems
// } from "../../redux/slice/inventorySlice";
import {
  fetchStoreStatistics,
  fetchPendingRequests,
  fetchLowStockItems,
  fetchStockAlerts,
  fetchStockStatusReport,
  fetchExpiredItems
} from "../../../redux/slice/inventorySlice";

const { Title, Text } = Typography;

const StoreDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get store state from Redux
  const {
    statistics,
    pendingRequests,
    lowStockItems,
    stockAlerts,
    stockStatus,
    expiredItems,
    loading
  } = useSelector((state) => state.warehouse);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    dispatch(fetchStoreStatistics())
      .unwrap()
      .catch((err) => message.error('Failed to load store statistics'));

    dispatch(fetchPendingRequests())
      .unwrap()
      .catch((err) => { });

    dispatch(fetchLowStockItems())
      .unwrap()
      .catch((err) => { });

    dispatch(fetchStockAlerts({ is_resolved: false }))
      .unwrap()
      .catch((err) => { });

    dispatch(fetchStockStatusReport())
      .unwrap()
      .catch((err) => { });

    dispatch(fetchExpiredItems())
      .unwrap()
      .catch((err) => { });
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  // Quick navigation handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'stockItems':
        navigate('/shared/store/stock/items');
        break;
      case 'pendingRequests':
        navigate('/shared/store/pending-requests');
        break;
      case 'lowStock':
        navigate('/shared/store/low-stock');
        break;
      case 'suppliers':
        navigate('/shared/store/suppliers');
        break;
      case 'purchaseOrders':
        navigate('/shared/store/purchase-orders');
        break;
      case 'reports':
        navigate('/shared/store/reports');
        break;
      case 'inventoryIn':
        navigate('/shared/store/inventory-in');
        break;
      case 'inventoryOut':
        navigate('/shared/store/inventory-out');
        break;
      default:
        break;
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '$0';
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  // Get alert color
  const getAlertColor = (type) => {
    switch (type) {
      case 'low_stock': return 'warning';
      case 'critical': return 'error';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      case 'depleted': return 'default';
      default: return 'default';
    }
  };

  // Statistics from API
  const stats = {
    totalItems: statistics?.totalItems || 0,
    totalValue: statistics?.totalValue || 0,
    lowStockAlerts: statistics?.lowStockAlerts || 0,
    pendingRequests: statistics?.pendingRequests || 0,
    expiredItems: statistics?.expiredItems || 0,
    totalSuppliers: statistics?.totalSuppliers || 0
  };

  // Low stock items for display
  const lowStockColumns = [
    {
      title: 'Item',
      dataIndex: 'item_name',
      key: 'item_name',
      render: (text, record) => (
        <Text strong>{text || record.item?.name}</Text>
      ),
    },
    {
      title: 'Current Qty',
      dataIndex: 'current_quantity',
      key: 'current_quantity',
      render: (qty, record) => (
        <Text type={record.is_critical ? 'danger' : 'warning'}>
          {qty} / {record.reorder_level}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.is_critical ? 'error' : 'warning'}>
          {record.is_critical ? 'Critical' : 'Low Stock'}
        </Tag>
      ),
    },
  ];

  // Pending requests columns
  const requestColumns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text code>{id?.slice(0, 8)}</Text>,
    },
    {
      title: 'Department',
      dataIndex: 'department_id',
      key: 'department_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small" onClick={() => navigate('/shared/store/pending-requests')}>
          View
        </Button>
      ),
    },
  ];

  // Alerts columns
  const alertColumns = [
    {
      title: 'Alert',
      dataIndex: 'message',
      key: 'message',
      render: (msg, record) => (
        <Space>
          <ExclamationCircleOutlined style={{ color: record.alert_type === 'low_stock' ? '#faad14' : '#ff4d4f' }} />
          <Text>{msg}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'alert_type',
      key: 'alert_type',
      render: (type) => (
        <Tag color={getAlertColor(type)}>{type?.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
  ];

  if (loading && !statistics) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <Spin size="large" />
        <Text>Loading Store Dashboard...</Text>
      </div>
    );
  }

  return (
    <div className="store-dashboard">
      {/* Header Section */}
      <div className="store-dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon-bg">
              <AppstoreOutlined className="header-icon" />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>Store Management Dashboard</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                {new Date().toLocaleDateString('en-US', {
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
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} className="kpi-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card total-items-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Total Items</span>}
              value={stats.totalItems}
              prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Active stock items</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card stock-value-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Stock Value</span>}
              value={stats.totalValue}
              formatter={(val) => formatCurrency(val)}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Total inventory value</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card pending-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Pending Requests</span>}
              value={stats.pendingRequests}
              prefix={<FileTextOutlined style={{ color: '#fa8c16' }} />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Awaiting approval</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="kpi-card alerts-card">
            <Statistic
              title={<span style={{ color: '#8c8c8c' }}>Low Stock Alerts</span>}
              value={stats.lowStockAlerts}
              prefix={<WarningOutlined style={{ color: stats.lowStockAlerts > 0 ? '#ff4d4f' : '#52c41a' }} />}
              valueStyle={{ color: stats.lowStockAlerts > 0 ? '#ff4d4f' : '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Items need attention</Text>
          </Card>
        </Col>
      </Row>

      {/* Secondary Stats Row */}
      <Row gutter={[16, 16]} className="secondary-stats">
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Suppliers</span>}
              value={stats.totalSuppliers}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Expired Items</span>}
              value={stats.expiredItems}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600, color: stats.expiredItems > 0 ? '#ff4d4f' : 'inherit' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Active Stock</span>}
              value={stockStatus?.active || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ fontSize: 20, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" className="mini-stat-card">
            <Statistic
              title={<span style={{ fontSize: 12, color: '#8c8c8c' }}>Depleted</span>}
              value={stockStatus?.depleted || 0}
              prefix={<InboxOutlined style={{ color: '#8c8c8c' }} />}
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
              icon={<InboxOutlined />}
              onClick={() => handleQuickAction('inventoryIn')}
              block
              className="quick-action-btn"
            >
              Inventory In
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleQuickAction('inventoryOut')}
              block
              className="quick-action-btn"
            >
              Inventory Out
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<AppstoreOutlined />}
              onClick={() => handleQuickAction('stockItems')}
              block
              className="quick-action-btn"
            >
              Stock Items
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => handleQuickAction('pendingRequests')}
              block
              className="quick-action-btn"
            >
              Requests
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<WarningOutlined />}
              onClick={() => handleQuickAction('lowStock')}
              block
              className="quick-action-btn"
            >
              Low Stock
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<ShoppingCartOutlined />}
              onClick={() => handleQuickAction('purchaseOrders')}
              block
              className="quick-action-btn"
            >
              Purchase Orders
            </Button>
          </Col>
          <Col xs={12} sm={8} md={3}>
            <Button
              icon={<TeamOutlined />}
              onClick={() => handleQuickAction('suppliers')}
              block
              className="quick-action-btn"
            >
              Suppliers
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
        </Row>
      </Card>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]} className="main-content" style={{ padding: '0 24px' }}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Stock Status Overview */}
          <Card
            className="stock-status-card"
            title={
              <Space>
                <PieChartOutlined />
                Stock Status Overview
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <div className="status-item">
                  <Progress
                    type="circle"
                    percent={stockStatus ? Math.round((stockStatus.active / (stockStatus.total || 1)) * 100) : 0}
                    strokeColor="#52c41a"
                    size={80}
                  />
                  <Text>Active</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-item">
                  <Progress
                    type="circle"
                    percent={stockStatus ? Math.round((stockStatus.expired / (stockStatus.total || 1)) * 100) : 0}
                    strokeColor="#ff4d4f"
                    size={80}
                  />
                  <Text>Expired</Text>
                </div>
              </Col>
              <Col span={8}>
                <div className="status-item">
                  <Progress
                    type="circle"
                    percent={stockStatus ? Math.round((stockStatus.depleted / (stockStatus.total || 1)) * 100) : 0}
                    strokeColor="#8c8c8c"
                    size={80}
                  />
                  <Text>Depleted</Text>
                </div>
              </Col>
            </Row>
            {stockStatus?.lowStock && stockStatus.lowStock.length > 0 && (
              <div className="low-stock-list" style={{ marginTop: 16 }}>
                <Text strong type="warning">Low Stock Items:</Text>
                <List
                  size="small"
                  dataSource={stockStatus.lowStock.slice(0, 3)}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <WarningOutlined style={{ color: '#faad14' }} />
                        <Text>{item.item_name}</Text>
                        <Tag color="warning">{item.current} / {item.reorder_level}</Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>

          {/* Pending Requests */}
          <Card
            className="requests-card"
            title={
              <Space>
                <FileTextOutlined />
                Pending Requests
                <Tag color="warning">{pendingRequests?.length || 0}</Tag>
              </Space>
            }
            extra={<Button type="link" onClick={() => navigate('/shared/store/pending-requests')}>View All <RightOutlined /></Button>}
          >
            <Table
              dataSource={pendingRequests?.slice(0, 5) || []}
              columns={requestColumns}
              pagination={false}
              size="small"
              rowKey="id"
              locale={{ emptyText: 'No pending requests' }}
            />
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Low Stock Alerts */}
          <Card
            className="alerts-card"
            title={
              <Space>
                <WarningOutlined style={{ color: '#faad14' }} />
                Low Stock Alerts
              </Space>
            }
            extra={<Button type="link" onClick={() => navigate('/shared/store/low-stock')}>View All</Button>}
          >
            {lowStockItems?.length > 0 ? (
              <List
                dataSource={lowStockItems.slice(0, 5)}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<WarningOutlined />}
                          style={{
                            backgroundColor: item.is_critical ? '#fff1f0' : '#fffbe6',
                            color: item.is_critical ? '#ff4d4f' : '#faad14'
                          }}
                        />
                      }
                      title={item.item_name}
                      description={
                        <Space>
                          <Text type="secondary">Qty: </Text>
                          <Text type={item.is_critical ? 'danger' : 'warning'} strong>
                            {item.current_quantity}
                          </Text>
                          <Text type="secondary"> / {item.reorder_level}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  All items are well stocked
                </Text>
              </div>
            )}
          </Card>

          {/* Recent Alerts */}
          <Card
            className="recent-alerts-card"
            title={
              <Space>
                <ExclamationCircleOutlined />
                System Alerts
              </Space>
            }
          >
            {stockAlerts?.length > 0 ? (
              <Table
                dataSource={stockAlerts.slice(0, 5)}
                columns={alertColumns}
                pagination={false}
                size="small"
                rowKey="id"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  No active alerts
                </Text>
              </div>
            )}
          </Card>

          {/* Expired Items Warning */}
          {expiredItems?.length > 0 && (
            <Card
              className="expired-card"
              title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                  Expired Items
                  <Tag color="error">{expiredItems.length}</Tag>
                </Space>
              }
              extra={<Button type="link" onClick={() => navigate('/shared/store/expired-items')}>View All</Button>}
            >
              <List
                size="small"
                dataSource={expiredItems.slice(0, 3)}
                renderItem={item => (
                  <List.Item>
                    <Space>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                      <Text>{item.item?.name || 'Unknown Item'}</Text>
                      <Text type="secondary">- Expired</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>
      </Row>

      <style>{`
        .store-dashboard {
          padding: 0;
          background: #f0f2f5;
          min-height: 100vh;
        }

        .store-dashboard-header {
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

        .total-items-card::before {
          background: linear-gradient(90deg, #1890ff, #69c0ff);
        }

        .stock-value-card::before {
          background: linear-gradient(90deg, #52c41a, #95de64);
        }

        .pending-card::before {
          background: linear-gradient(90deg, #fa8c16, #ffc069);
        }

        .alerts-card::before {
          background: linear-gradient(90deg, #ff4d4f, #ff7875);
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

        .main-content {
          margin-top: 16px;
          padding-bottom: 24px;
        }

        .stock-status-card,
        .requests-card,
        .alerts-card,
        .recent-alerts-card,
        .expired-card {
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .kpi-cards,
          .quick-actions-card,
          .secondary-stats,
          .main-content {
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
        .quick-actions-card,
        .stock-status-card,
        .requests-card,
        .alerts-card {
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

export default StoreDashboard;

