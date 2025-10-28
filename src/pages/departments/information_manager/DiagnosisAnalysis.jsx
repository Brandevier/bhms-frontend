// components/diagnosis/DiagnosisAnalysis.js
import React from 'react';
import { Row, Col, Spin, Alert, Card, Typography } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { useDiagnosisAnalysis } from '../../../redux/hooks/useDiagnosisAnalysis';
import TopDiseasesChart from './components/TopDiseasesChart';
import GenderDistributionChart from './components/GenderDistributionChart';
import StatusSummaryChart from './components/StatusSummaryChart';

const { Title } = Typography;

const DiagnosisAnalysis = () => {
  const { topDiseases, genderDistribution, statusSummary, loading, error } =
    useDiagnosisAnalysis();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading diagnosis analysis..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Diagnosis Analysis"
        description={error || 'Failed to load diagnosis analysis data. Please try again.'}
        type="error"
        showIcon
      />
    );
  }

  // Check if data is empty
  const isEmpty = 
    (!topDiseases?.data || topDiseases.data.length === 0) &&
    (!genderDistribution?.data || genderDistribution.data.length === 0) &&
    (!statusSummary?.data || statusSummary.data.length === 0);

  if (isEmpty) {
    return (
      <Card className="text-center py-12">
        <DashboardOutlined className="text-4xl text-gray-400 mb-4" />
        <Title level={4} className="text-gray-600">No Diagnosis Data Available</Title>
        <p className="text-gray-500">There is no diagnosis analysis data to display at this time.</p>
      </Card>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center">
          <DashboardOutlined className="mr-3 text-blue-500" />
          Diagnosis Analysis Dashboard
        </Title>
        <p className="text-gray-600">
          Comprehensive overview of disease patterns, gender distribution, and status analysis
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Top Diseases */}
        {topDiseases?.data && topDiseases.data.length > 0 && (
          <Col xs={24} lg={12}>
            <TopDiseasesChart 
              topDiseases={topDiseases} 
              interpretation={topDiseases.interpretation} 
            />
          </Col>
        )}

        {/* Gender Distribution */}
        {genderDistribution?.data && genderDistribution.data.length > 0 && (
          <Col xs={24} lg={12}>
            <GenderDistributionChart 
              genderDistribution={genderDistribution} 
              interpretation={genderDistribution.interpretation} 
            />
          </Col>
        )}

        {/* Status Summary - Full width */}
        {statusSummary?.data && statusSummary.data.length > 0 && (
          <Col xs={24}>
            <StatusSummaryChart 
              statusSummary={statusSummary} 
              interpretation={statusSummary.interpretation} 
            />
          </Col>
        )}
      </Row>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Title level={3} className="text-blue-600">
              {topDiseases?.data?.length || 0}
            </Title>
            <p>Total Diseases Tracked</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Title level={3} className="text-green-600">
              {genderDistribution?.data?.reduce((sum, g) => sum + g.count, 0) || 0}
            </Title>
            <p>Total Cases Analyzed</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Title level={3} className="text-purple-600">
              {statusSummary?.data?.length || 0}
            </Title>
            <p>Status Categories</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DiagnosisAnalysis;