// components/lab/LabAnalytics.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Spin, Alert, Typography } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { fetchLabAnalytics } from '../../../../redux/slice/labSlice';
import LabStatusSummary from './components/LabStatusSummary';
import TopTestsChart from './components/TopTestsChart';
import DepartmentPerformance from './components/DepartmentPerformance';
import StaffPerformance from './components/StaffPerformance';
import AbnormalResults from './components/AbnormalResults';

const { Title } = Typography;

const LabAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.lab);

  useEffect(() => {
    dispatch(fetchLabAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading Lab Analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Lab Analytics"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  const isEmpty = !analytics || (
    (!analytics.statusSummary || analytics.statusSummary.length === 0) &&
    (!analytics.topTests || analytics.topTests.length === 0)
  );

  if (isEmpty) {
    return (
      <Card className="text-center py-12">
        <ExperimentOutlined className="text-4xl text-gray-400 mb-4" />
        <Title level={4} className="text-gray-600">No Lab Data Available</Title>
        <p className="text-gray-500">There is no laboratory analytics data to display at this time.</p>
      </Card>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <ExperimentOutlined className="mr-3 text-green-500" />
          Laboratory Analytics Dashboard
        </Title>
        <p className="text-gray-600">
          Comprehensive overview of test volumes, turnaround times, and laboratory performance
        </p>
      </div>

      {/* Status Summary - Top Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24}>
          <LabStatusSummary data={analytics.statusSummary} />
        </Col>
      </Row>

      {/* Middle Row - Top Tests & Department Performance */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <TopTestsChart data={analytics.topTests} />
        </Col>
        <Col xs={24} lg={12}>
          <DepartmentPerformance data={analytics.departmentPerformance} />
        </Col>
      </Row>

      {/* Bottom Row - Staff Performance & Abnormal Results */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <StaffPerformance data={analytics.staffPerformance} />
        </Col>
        <Col xs={24} lg={12}>
          <AbnormalResults data={analytics.abnormalSummary} />
        </Col>
      </Row>
    </div>
  );
};

export default LabAnalytics;