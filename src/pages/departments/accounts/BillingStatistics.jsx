import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, DatePicker, Spin, Alert } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillingStatistics } from "../../../redux/slice/billingStatsSlice";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const { RangePicker } = DatePicker;

const BillingStatistics = () => {
  const dispatch = useDispatch();
  const { 
    overview = {}, 
    time_based = [], 
    department_stats = {}, 
    service_stats = {}, 
    trends = {}, 
    current_period = {},
    loading,
    error
  } = useSelector((state) => state.billingStats);

  useEffect(() => {
    dispatch(fetchBillingStatistics());
  }, [dispatch]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  // Safely prepare data for charts with fallbacks
  const monthlyRevenueData = {
    labels: Array.isArray(time_based) 
      ? time_based.map(item => `${item.month}/${item.year}`)
      : [],
    datasets: [
      {
        label: 'Revenue',
        data: Array.isArray(time_based) 
          ? time_based.map(item => item.revenue || 0)
          : [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const departmentDistributionData = {
    labels: department_stats?.by_revenue?.length 
      ? department_stats.by_revenue.map(dept => dept.name)
      : [],
    datasets: [
      {
        label: 'Revenue by Department',
        data: department_stats?.by_revenue?.length
          ? department_stats.by_revenue.map(dept => dept.revenue)
          : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dailyTrendsData = {
    labels: trends?.daily?.length
      ? trends.daily.map(day => day.date)
      : [],
    datasets: [
      {
        label: 'Daily Revenue',
        data: trends?.daily?.length
          ? trends.daily.map(day => day.revenue)
          : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
    ],
  };

  const topServicesData = {
    labels: service_stats?.highest_revenue?.length
      ? service_stats.highest_revenue.map(service => service.name)
      : [],
    datasets: [
      {
        label: 'Revenue',
        data: service_stats?.highest_revenue?.length
          ? service_stats.highest_revenue.map(service => service.revenue)
          : [],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Overview Stats */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Bills"
              value={overview.total_bills || 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={overview.total_revenue || 0}
              precision={2}
              prefix="₵"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Paid Bills"
              value={overview.paid_bills || 0}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Unpaid Bills"
              value={overview.unpaid_bills || 0}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Date Range Picker */}
      <div style={{ marginBottom: '24px' }}>
        <RangePicker style={{ width: '100%', maxWidth: '400px' }} />
      </div>

      {/* Revenue Trends */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Monthly Revenue">
            {time_based?.length ? (
              <Bar 
                data={monthlyRevenueData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Revenue by Month',
                    },
                  },
                }}
              />
            ) : (
              <Alert message="No monthly revenue data available" type="info" showIcon />
            )}
          </Card>
        </Col>
      </Row>

      {/* Department and Service Stats */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Revenue by Department">
            {department_stats?.by_revenue?.length ? (
              <Pie 
                data={departmentDistributionData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            ) : (
              <Alert message="No department data available" type="info" showIcon />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Daily Revenue Trends">
            {trends?.daily?.length ? (
              <Line 
                data={dailyTrendsData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            ) : (
              <Alert message="No daily trends data available" type="info" showIcon />
            )}
          </Card>
        </Col>
      </Row>

      {/* Top Services */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Top Services by Revenue">
            {service_stats?.highest_revenue?.length ? (
              <Bar
                data={topServicesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            ) : (
              <Alert message="No service data available" type="info" showIcon />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BillingStatistics;