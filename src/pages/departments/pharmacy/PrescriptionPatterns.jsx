import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Select, 
  DatePicker, 
  Divider, 
  Typography,
  Tabs,
  Tag
} from 'antd';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined, 
  WarningOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Option } = Select;

const PrescriptionPatterns = () => {
  // State for filters
  const [dateRange, setDateRange] = useState(null);
  const [department, setDepartment] = useState('all');
  const [drugCategory, setDrugCategory] = useState('all');

  // Dummy Data
  const statsData = {
    totalPrescriptions: 1428,
    uniquePrescribers: 24,
    mostPrescribedDrug: 'Paracetamol',
    avgDrugsPerRx: 2.7,
    antibioticUse: 42,
  };

  const topDrugsData = [
    { name: 'Paracetamol', count: 420, avgDose: '500mg', topDept: 'OPD' },
    { name: 'Amoxicillin', count: 315, avgDose: '500mg', topDept: 'Pediatrics' },
    { name: 'Diclofenac', count: 198, avgDose: '50mg', topDept: 'Surgery' },
    { name: 'Metformin', count: 156, avgDose: '850mg', topDept: 'Internal Medicine' },
    { name: 'Artemether-Lumefantrine', count: 132, avgDose: '80/480mg', topDept: 'OPD' },
  ];

  const prescriberData = [
    { 
      name: 'Dr. Kwame Mensah', 
      total: 142, 
      topDrugs: ['Paracetamol', 'Amoxicillin', 'Metronidazole'], 
      antibioticRate: 65,
      avgDrugs: 2.5
    },
    { 
      name: 'Dr. Ama Afia', 
      total: 128, 
      topDrugs: ['Diclofenac', 'Metformin', 'Paracetamol'], 
      antibioticRate: 29,
      avgDrugs: 3.2
    },
    { 
      name: 'Dr. Yaw Boateng', 
      total: 98, 
      topDrugs: ['Artemether-Lumefantrine', 'Paracetamol', 'Co-trimoxazole'], 
      antibioticRate: 52,
      avgDrugs: 2.8
    },
  ];

  const departmentData = [
    { name: 'OPD', prescriptions: 680, avgDrugs: 2.2, antibiotics: 38 },
    { name: 'Pediatrics', prescriptions: 420, avgDrugs: 3.1, antibiotics: 60 },
    { name: 'Surgery', prescriptions: 215, avgDrugs: 1.9, antibiotics: 21 },
    { name: 'Internal Medicine', prescriptions: 113, avgDrugs: 3.4, antibiotics: 45 },
  ];

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Paracetamol',
        data: [65, 59, 80, 81, 56, 72],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
      },
      {
        label: 'Amoxicillin',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: '#ff4d4f',
        backgroundColor: 'rgba(255, 77, 79, 0.2)',
      },
    ],
  };

  const categoryData = {
    labels: ['Antibiotics', 'Analgesics', 'Antimalarials', 'Others'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: [
          '#ff4d4f',
          '#1890ff',
          '#52c41a',
          '#faad14',
        ],
      },
    ],
  };

  const redFlags = [
    { 
      type: 'High Antibiotic Use', 
      doctor: 'Dr. Kwame Mensah', 
      rate: '65%', 
      threshold: '>50%' 
    },
    { 
      type: 'Polypharmacy', 
      prescription: 'RX-2023-0482', 
      drugs: 5, 
      threshold: '>4 drugs' 
    },
    { 
      type: 'Unusual Dosage', 
      drug: 'Diclofenac', 
      dose: '100mg', 
      typical: '50mg' 
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>
        <MedicineBoxOutlined /> Prescription Patterns Analysis
      </Title>
      <Text type="secondary">
        Track prescribing trends, identify outliers, and optimize medication use
      </Text>
      <Divider />

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <RangePicker 
              style={{ width: '100%' }} 
              onChange={setDateRange}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by Department"
              onChange={setDepartment}
            >
              <Option value="all">All Departments</Option>
              <Option value="opd">OPD</Option>
              <Option value="pediatrics">Pediatrics</Option>
              <Option value="surgery">Surgery</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by Drug Category"
              onChange={setDrugCategory}
            >
              <Option value="all">All Categories</Option>
              <Option value="antibiotics">Antibiotics</Option>
              <Option value="analgesics">Analgesics</Option>
              <Option value="antimalarials">Antimalarials</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Prescriptions"
              value={statsData.totalPrescriptions}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Unique Prescribers"
              value={statsData.uniquePrescribers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Most Prescribed Drug"
              value={statsData.mostPrescribedDrug}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Antibiotic Use"
              value={statsData.antibioticUse}
              suffix="%"
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs defaultActiveKey="1">
        <TabPane tab={<span><BarChartOutlined /> By Drug</span>} key="1">
          <Card title="Top Prescribed Medications">
            <Bar
              data={{
                labels: topDrugsData.map(d => d.name),
                datasets: [
                  {
                    label: 'Prescription Count',
                    data: topDrugsData.map(d => d.count),
                    backgroundColor: 'rgba(24, 144, 255, 0.7)',
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
            <Table
              dataSource={topDrugsData}
              columns={[
                { title: 'Drug Name', dataIndex: 'name', key: 'name' },
                { title: 'Times Prescribed', dataIndex: 'count', key: 'count' },
                { title: 'Average Dose', dataIndex: 'avgDose', key: 'avgDose' },
                { title: 'Top Department', dataIndex: 'topDept', key: 'topDept' },
              ]}
              rowKey="name"
              pagination={false}
              style={{ marginTop: 24 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><UserOutlined /> By Prescriber</span>} key="2">
          <Card title="Prescriber Patterns">
            <Table
              dataSource={prescriberData}
              columns={[
                { title: 'Doctor', dataIndex: 'name', key: 'name' },
                { title: 'Total Rx', dataIndex: 'total', key: 'total' },
                { 
                  title: 'Top 3 Drugs', 
                  dataIndex: 'topDrugs', 
                  key: 'topDrugs',
                  render: drugs => drugs.join(', ')
                },
                { 
                  title: 'Antibiotic %', 
                  dataIndex: 'antibioticRate', 
                  key: 'antibioticRate',
                  render: rate => <Tag color={rate > 50 ? 'red' : 'green'}>{rate}%</Tag>
                },
                { title: 'Avg Drugs/Rx', dataIndex: 'avgDrugs', key: 'avgDrugs' },
              ]}
              rowKey="name"
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><TeamOutlined /> By Department</span>} key="3">
          <Card title="Department-wise Distribution">
            <Row gutter={16}>
              <Col span={12}>
                <Pie
                  data={{
                    labels: departmentData.map(d => d.name),
                    datasets: [
                      {
                        data: departmentData.map(d => d.prescriptions),
                        backgroundColor: [
                          '#1890ff',
                          '#52c41a',
                          '#faad14',
                          '#ff4d4f',
                        ],
                      }
                    ]
                  }}
                />
              </Col>
              <Col span={12}>
                <Table
                  dataSource={departmentData}
                  columns={[
                    { title: 'Department', dataIndex: 'name', key: 'name' },
                    { title: 'Prescriptions', dataIndex: 'prescriptions', key: 'prescriptions' },
                    { title: 'Avg Drugs/Rx', dataIndex: 'avgDrugs', key: 'avgDrugs' },
                    { 
                      title: 'Antibiotics %', 
                      dataIndex: 'antibiotics', 
                      key: 'antibiotics',
                      render: rate => <Tag color={rate > 50 ? 'red' : 'blue'}>{rate}%</Tag>
                    },
                  ]}
                  rowKey="name"
                  pagination={false}
                />
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane tab={<span><LineChartOutlined /> Trends</span>} key="4">
          <Card title="Prescription Trends Over Time">
            <Line 
              data={trendData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><PieChartOutlined /> Categories</span>} key="5">
          <Card title="Drug Category Distribution">
            <Row gutter={16}>
              <Col span={12}>
                <Pie 
                  data={categoryData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                    },
                  }}
                />
              </Col>
              <Col span={12}>
                <Table
                  dataSource={categoryData.labels.map((label, i) => ({
                    category: label,
                    percentage: categoryData.datasets[0].data[i]
                  }))}
                  columns={[
                    { title: 'Category', dataIndex: 'category', key: 'category' },
                    { 
                      title: 'Percentage', 
                      dataIndex: 'percentage', 
                      key: 'percentage',
                      render: pct => `${pct}%`
                    },
                  ]}
                  rowKey="category"
                  pagination={false}
                />
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane tab={<span><WarningOutlined /> Red Flags</span>} key="6">
          <Card title="Potential Issues Requiring Review">
            <Table
              dataSource={redFlags}
              columns={[
                { 
                  title: 'Type', 
                  dataIndex: 'type', 
                  key: 'type',
                  render: type => <Tag color="red">{type}</Tag>
                },
                { title: 'Entity', dataIndex: 'doctor' || 'prescription' || 'drug', key: 'entity' },
                { title: 'Value', dataIndex: 'rate' || 'drugs' || 'dose', key: 'value' },
                { title: 'Threshold', dataIndex: 'threshold', key: 'threshold' },
              ]}
              rowKey="type"
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PrescriptionPatterns;