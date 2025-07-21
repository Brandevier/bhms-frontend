import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Statistic, Spin, Divider } from 'antd';
import { 
  ExperimentOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  BarChartOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { getLabStatistics } from '../../../../redux/slice/labSlice';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const LabStats = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.lab);

  useEffect(() => {
    dispatch(getLabStatistics());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Prepare data for charts
  const testStatusData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [statistics?.completedTests || 0, statistics?.pendingTests || 0],
        backgroundColor: ['#52c41a', '#faad14'],
        borderColor: ['#52c41a', '#faad14'],
        borderWidth: 1,
      },
    ],
  };

  const testsPerDayData = {
    labels: statistics?.testsPerDay?.map(day => new Date(day.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Tests Per Day',
        data: statistics?.testsPerDay?.map(day => day.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const topTestsData = {
    labels: statistics?.topTests?.map(test => test.templateId) || [],
    datasets: [
      {
        label: 'Test Count',
        data: statistics?.topTests?.map(test => test.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Laboratory Statistics Dashboard</h1>
      
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Tests"
              value={statistics?.totalTests || 0}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Tests"
              value={statistics?.completedTests || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Tests"
              value={statistics?.pendingTests || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Test Templates"
              value={statistics?.totalTemplates || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Today's Activity */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Today's Activity" style={{ height: '100%' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Tests Completed Today"
                  value={statistics?.todayCompleted || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tests Pending Today"
                  value={statistics?.todayPending || 0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Test Status Distribution" style={{ height: '100%' }}>
            <div style={{ height: '200px' }}>
              <Pie
                data={testStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Charts Section */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Tests Per Day" style={{ height: '100%' }}>
            <div style={{ height: '300px' }}>
              <Line
                data={testsPerDayData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 5 Tests" style={{ height: '100%' }}>
            <div style={{ height: '300px' }}>
              <Bar
                data={topTestsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Template Distribution */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Tests by Template">
            <Row gutter={16}>
              {statistics?.testsByTemplate?.map((template, index) => (
                <Col key={index} span={6} style={{ marginBottom: '16px' }}>
                  <Card>
                    <Statistic
                      title={`Template ${template.templateId.substring(0, 8)}...`}
                      value={template.count}
                      prefix={<BarChartOutlined />}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LabStats;