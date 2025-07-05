import React from "react";
import { 
  Card, Row, Col, Table, Button, Statistic, Tag, 
  Progress, Divider, Badge, Space, Typography 
} from "antd";
import { 
  DashboardOutlined, FileAddOutlined, ClockCircleOutlined, 
  WarningOutlined, CheckCircleOutlined, SyncOutlined,
  MedicineBoxOutlined, ExperimentOutlined, CodeOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

// ========= DUMMY DATA =========
const summaryData = {
  pending: 18,
  approved: 245,
  rejected: 12,
  avgProcessingTime: "1.2 days",
  nhiaCompliance: 92, // %
  totalPayout: "₵ 148,750"
};

const recentClaims = [
  {
    key: "1",
    claimId: "NHIA-2023-0876",
    patient: "Kwame Asare",
    provider: "Korle-Bu Hospital",
    service: "Malaria Treatment",
    icd10: "B54",
    date: "2023-05-15",
    status: "pending",
    priority: "high",
    nhiaValid: true
  },
  // ... more dummy claims
];

const nhiaAlerts = [
  { id: 1, message: "2 claims missing NHIS numbers", level: "warning" },
  { id: 2, message: "NHIA server sync required", level: "error" }
];

// ========= COMPONENTS =========
const StatusTag = ({ status }) => {
  const color = {
    pending: "orange",
    approved: "green",
    rejected: "red"
  };
  return <Tag color={color[status]}>{status.toUpperCase()}</Tag>;
};

const PriorityBadge = ({ priority }) => {
  const color = {
    high: "red",
    medium: "orange",
    low: "blue"
  };
  return <Badge color={color[priority]} text={priority} />;
};

// ========= DASHBOARD LAYOUT =========
const ClaimsDashboard = () => (
  <div style={{ padding: 24 }}>
    {/* HEADER */}
    <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
      <Title level={3}>NHIA Claims Dashboard</Title>
      <Space>
        <Button type="primary" icon={<SyncOutlined />}>Sync with NHIA</Button>
        <Button type="default" icon={<FileAddOutlined />}>New Claim</Button>
      </Space>
    </Row>

    {/* SUMMARY CARDS */}
    <Row gutter={16} style={{ marginBottom: 20 }}>
      <Col span={4}>
        <Card>
          <Statistic title="Pending Claims" value={summaryData.pending} prefix={<ClockCircleOutlined />} />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic title="Approved (MTD)" value={summaryData.approved} prefix={<CheckCircleOutlined />} />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic title="Avg. Processing" value={summaryData.avgProcessingTime} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <div>NHIA Compliance</div>
          <Progress percent={summaryData.nhiaCompliance} status="active" />
          <Text type="secondary">₵{summaryData.totalPayout} paid this month</Text>
        </Card>
      </Col>
    </Row>

    {/* ALERTS & QUICK ACTIONS */}
    <Row gutter={16} style={{ marginBottom: 20 }}>
      <Col span={12}>
        <Card 
          title={<><WarningOutlined /> NHIA Alerts</>} 
          bordered={false}
          headStyle={{ backgroundColor: "#fffbe6" }}
        >
          {nhiaAlerts.map(alert => (
            <div key={alert.id} style={{ marginBottom: 8 }}>
              <Tag color={alert.level === "error" ? "red" : "orange"}>
                {alert.message}
              </Tag>
            </div>
          ))}
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Quick Actions" bordered={false}>
          <Space wrap>
            <Button icon={<MedicineBoxOutlined />}>Add Medication</Button>
            <Button icon={<ExperimentOutlined />}>Record Lab Test</Button>
            <Button icon={<CodeOutlined />}>ICD-10 Lookup</Button>
          </Space>
        </Card>
      </Col>
    </Row>

    {/* PRIORITY CLAIMS TABLE */}
    <Card 
      title="Pending Claims Requiring Action" 
      extra={<a href="#">View All</a>}
    >
      <Table 
        dataSource={recentClaims} 
        columns={[
          {
            title: 'Claim ID',
            dataIndex: 'claimId',
            render: (text) => <a href="#">{text}</a>
          },
          {
            title: 'Patient',
            dataIndex: 'patient'
          },
          {
            title: 'Service',
            dataIndex: 'service' 
          },
          {
            title: 'ICD-10',
            dataIndex: 'icd10',
            render: (code) => <Tag>{code}</Tag>
          },
          {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => <StatusTag status={status} />
          },
          {
            title: 'Priority',
            dataIndex: 'priority',
            render: (priority) => <PriorityBadge priority={priority} />
          }
        ]}
        pagination={false}
      />
    </Card>
  </div>
);

export default ClaimsDashboard;