import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Progress,
  Typography,
  Space,
  Alert,
  Spin
} from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

import { useDashboard } from '../../../redux/hooks/useAccountHooks';


const { Title, Text } = Typography;

const AccountStatistics = () => {
  const { data, loading, error, refetch } = useDashboard();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message || 'Failed to load account statistics'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!data) {
    return (
      <Alert
        message="No Data"
        description="No account statistics data available"
        type="warning"
        showIcon
      />
    );
  }

  const {
    outstanding,
    nhiaClaims,
    patientCollections,
    departmentRevenue,
    serviceTypeRevenue,
    staffBilling,
    agingReport
  } = data;

  // Calculate totals
  const totalOutstanding = outstanding?.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);
  const totalNHIAClaims = parseFloat(nhiaClaims?.total_nhia_amount || 0);
  const totalPatientAmount = parseFloat(patientCollections?.total_patient_amount || 0);
  const totalBilledAmount = parseFloat(patientCollections?.total_billed_amount || 0);

  // Table columns
  const outstandingColumns = [
    {
      title: 'Patient',
      dataIndex: 'patient',
      key: 'patient',
      render: (patient) => `${patient?.first_name} ${patient?.last_name}`,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => department?.name,
    },
    {
      title: 'Service',
      dataIndex: 'service_type',
      key: 'service_type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Amount (GHS)',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => `₵${parseFloat(amount).toFixed(2)}`,
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <Tag color={status === 'Overdue' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  const agingColumns = [
    {
      title: 'Days Outstanding',
      dataIndex: 'days_outstanding',
      key: 'days_outstanding',
      render: (daysObj) => `${daysObj?.days || 0} days`,
    },
    {
      title: 'Bill Amount (GHS)',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => `₵${parseFloat(amount).toFixed(2)}`,
      align: 'right',
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <Tag color={status === 'Overdue' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Accounts Dashboard</Title>
        
        {/* Key Metrics Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Outstanding"
                value={totalOutstanding}
                precision={2}
                prefix="₵"
                valueStyle={{ color: '#cf1322' }}
                suffix={
                  <Tag color="red">
                    {outstanding?.length} bills
                  </Tag>
                }
              />
              <Progress
                percent={((totalOutstanding / totalBilledAmount) * 100) || 0}
                status="active"
                showInfo={false}
                strokeColor="#ff4d4f"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="NHIA Claims"
                value={totalNHIAClaims}
                precision={2}
                prefix="₵"
                valueStyle={{ color: '#1890ff' }}
                suffix={
                  <Tag color="blue">
                    {nhiaClaims?.total_claims} claims
                  </Tag>
                }
              />
              <Text type="secondary">National Health Insurance</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Patient Collections"
                value={totalPatientAmount}
                precision={2}
                prefix="₵"
                valueStyle={{ color: '#52c41a' }}
              />
              <Text type="secondary">Total Billed: ₵{totalBilledAmount.toFixed(2)}</Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Aging Bills"
                value={agingReport?.length || 0}
                suffix="bills"
                valueStyle={{ color: '#faad14' }}
              />
              <Text type="secondary">Requiring follow-up</Text>
            </Card>
          </Col>
        </Row>

        {/* Revenue Breakdown Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <ShopOutlined />
                  Department Revenue
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {departmentRevenue?.map((dept) => (
                  <div key={dept.department_id}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{dept.department?.name}</Text>
                        <Text>₵{parseFloat(dept.total_revenue).toFixed(2)}</Text>
                      </div>
                      <Progress
                        percent={((parseFloat(dept.total_revenue) / totalBilledAmount) * 100) || 0}
                        size="small"
                        showInfo={false}
                      />
                    </Space>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <MedicineBoxOutlined />
                  Service Type Revenue
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {serviceTypeRevenue?.map((service) => (
                  <div key={service.service_type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tag color="blue">{service.service_type}</Tag>
                      <Text strong>₵{parseFloat(service.total_revenue).toFixed(2)}</Text>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Outstanding Payments */}
        <Card
          title={
            <Space>
              <FileTextOutlined />
              Outstanding Payments ({outstanding?.length} bills)
            </Space>
          }
        >
          <Table
            columns={outstandingColumns}
            dataSource={outstanding}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </Card>

        {/* Aging Report */}
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              Aging Report
            </Space>
          }
        >
          <Table
            columns={agingColumns}
            dataSource={agingReport}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </Card>

        {/* Staff Billing Summary */}
        {staffBilling?.some(staff => staff.staff_id) && (
          <Card
            title={
              <Space>
                <UserOutlined />
                Staff Billing Summary
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {staffBilling
                ?.filter(staff => staff.staff_id)
                .map((staff) => (
                  <Col xs={24} sm={12} md={8} key={staff.staff_id}>
                    <Card size="small">
                      <Statistic
                        title={`${staff.staff?.first_name} ${staff.staff?.last_name}`}
                        value={parseFloat(staff.total_billed)}
                        precision={2}
                        prefix="₵"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Card>
                  </Col>
                ))}
            </Row>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default AccountStatistics;