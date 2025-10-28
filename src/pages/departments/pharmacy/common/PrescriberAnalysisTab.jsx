import React from 'react';
import { Card, Table, Tag, Row, Col, Typography, Progress, Statistic } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { UserOutlined, MedicineBoxOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PrescriberAnalysisTab = ({ data }) => {
  // Extract data from API response
  const { core, departments, top_medications } = data;

  // Prepare department-wise prescriber analysis
  const departmentData = departments?.map(dept => ({
    name: dept.name,
    prescriptions: parseInt(dept.prescription_count) || 0,
    emergencies: parseInt(dept.emergency_count) || 0,
    prescriptionRate: dept.prescription_count > 0 ? 
      Math.round((dept.emergency_count / dept.prescription_count) * 100) : 0
  })) || [];

  // Prepare medication category analysis
  const medicationCategories = top_medications?.reduce((acc, med) => {
    const category = med.medicine?.unit_of_pricing || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseInt(med.prescription_count) || 0;
    return acc;
  }, {});

  const categoryChartData = Object.entries(medicationCategories || {}).map(([name, value]) => ({
    name,
    value
  }));

  // Colors for charts
  const departmentColors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f'];
  const categoryColors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#13c2c2'];

  const columns = [
    {
      title: 'Department',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <div>
          <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {name}
        </div>
      )
    },
    {
      title: 'Total Prescriptions',
      dataIndex: 'prescriptions',
      key: 'prescriptions',
      render: (count) => <Text strong>{count}</Text>
    },
    {
      title: 'Emergency Cases',
      dataIndex: 'emergencies',
      key: 'emergencies',
      render: (count) => (
        <Tag color={count > 10 ? 'red' : count > 5 ? 'orange' : 'blue'}>
          {count}
        </Tag>
      )
    },
    {
      title: 'Emergency Rate',
      dataIndex: 'prescriptionRate',
      key: 'prescriptionRate',
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          status={rate > 30 ? 'exception' : rate > 15 ? 'active' : 'normal'}
          style={{ width: 100 }}
        />
      )
    }
  ];

  return (
    <div>
      {/* Key Statistics Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Prescribers"
              value={departments?.length || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Avg Prescriptions/Dept"
              value={core?.total ? Math.round(core.total / (departments?.length || 1)) : 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Emergency Rate"
              value={core?.total ? Math.round((core.emergency / core.total) * 100) : 0}
              suffix="%"
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Avg Drugs/Rx"
              value={parseFloat(core?.avg_quantity || 0).toFixed(1)}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Prescriptions by Department" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="prescriptions" name="Total Prescriptions" fill="#1890ff" />
                <Bar dataKey="emergencies" name="Emergency Cases" fill="#ff4d4f" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Medication Categories" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Department Analysis Table */}
      <Card title="Department Prescribing Patterns">
        <Table
          dataSource={departmentData}
          columns={columns}
          rowKey="name"
          pagination={false}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>{core?.total || 0}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Tag color="red">
                    <Text strong>{core?.emergency || 0}</Text>
                  </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Progress 
                    percent={core?.total ? Math.round((core.emergency / core.total) * 100) : 0}
                    status="active"
                    size="small"
                    style={{ width: 100 }}
                  />
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      {/* Top Medications Insight */}
      {top_medications && top_medications.length > 0 && (
        <Card title="Top Medications Overview" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            {top_medications.slice(0, 3).map((med, index) => (
              <Col span={8} key={med.medication_id}>
                <Card size="small">
                  <Statistic
                    title={med.medicine?.generic_name || 'Unknown Medication'}
                    value={med.prescription_count}
                    suffix="prescriptions"
                    prefix={<MedicineBoxOutlined />}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {med.total_quantity} units total
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default PrescriberAnalysisTab;