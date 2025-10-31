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

  // Debug: Check the actual structure
  console.log('Data structure:', {
    topDiseases,
    genderDistribution, 
    statusSummary
  });

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

  // Safely check if data is empty based on the actual structure
  const hasTopDiseases = topDiseases?.data && Array.isArray(topDiseases.data) && topDiseases.data.length > 0;
  const hasGenderDistribution = genderDistribution?.data && Array.isArray(genderDistribution.data) && genderDistribution.data.length > 0;
  const hasStatusSummary = statusSummary?.data && Array.isArray(statusSummary.data) && statusSummary.data.length > 0;

  const isEmpty = !hasTopDiseases && !hasGenderDistribution && !hasStatusSummary;

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
        {hasTopDiseases && (
          <Col xs={24} lg={12}>
            <TopDiseasesChart 
              data={topDiseases.data}
              interpretation={topDiseases.interpretation} 
            />
          </Col>
        )}

        {/* Gender Distribution */}
        {hasGenderDistribution && (
          <Col xs={24} lg={12}>
            <GenderDistributionChart 
              data={genderDistribution.data}
              interpretation={genderDistribution.interpretation} 
            />
          </Col>
        )}

        {/* Status Summary - Full width */}
        {hasStatusSummary && (
          <Col xs={24}>
            <StatusSummaryChart 
              data={statusSummary.data}
              interpretation={statusSummary.interpretation} 
            />
          </Col>
        )}
      </Row>

      {/* Summary Statistics - FIXED */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Title level={3} className="text-blue-600">
              {hasTopDiseases ? topDiseases.data.length : 0}
            </Title>
            <p>Total Diseases Tracked</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Title level={3} className="text-green-600">
              {hasGenderDistribution ? 
                genderDistribution.data.reduce((sum, item) => sum + parseInt(item.count || 0), 0) 
                : 0
              }
            </Title>
            <p>Total Cases Analyzed</p>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <Title level={3} className="text-purple-600">
              {hasStatusSummary ? statusSummary.data.length : 0}
            </Title>
            <p>Status Categories</p>
          </Card>
        </Col>
      </Row>

      {/* Interpretation Insights */}
      <Row gutter={[16, 16]} className="mt-6">
        {/* Top Diseases Insights */}
        {topDiseases?.interpretation && Array.isArray(topDiseases.interpretation) && topDiseases.interpretation.length > 0 && (
          <Col xs={24} lg={12}>
            <Card title="Disease Insights" className="h-full">
              {topDiseases.interpretation.map((item, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <p className="text-sm text-gray-700">
                    <strong>{item.disease}:</strong> {item.insight}
                  </p>
                </div>
              ))}
            </Card>
          </Col>
        )}

        {/* Gender Distribution Insights */}
        {genderDistribution?.interpretation && Array.isArray(genderDistribution.interpretation) && genderDistribution.interpretation.length > 0 && (
          <Col xs={24} lg={12}>
            <Card title="Gender Distribution Insights" className="h-full">
              {genderDistribution.interpretation.map((item, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <p className="text-sm text-gray-700">
                    <strong>{item.gender || 'Unknown'}:</strong> {item.insight}
                  </p>
                </div>
              ))}
            </Card>
          </Col>
        )}

        {/* Status Summary Insights */}
        {statusSummary?.interpretation && Array.isArray(statusSummary.interpretation) && statusSummary.interpretation.length > 0 && (
          <Col xs={24}>
            <Card title="Status Insights" className="mt-4">
              {statusSummary.interpretation.map((item, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <p className="text-sm text-gray-700">
                    <strong>{item.status}:</strong> {item.insight}
                  </p>
                </div>
              ))}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DiagnosisAnalysis;