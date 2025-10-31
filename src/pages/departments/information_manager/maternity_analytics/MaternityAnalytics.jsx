// components/maternity/MaternityAnalytics.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Spin, Alert } from 'antd';
import { fetchMaternityAnalytics } from '../../../../redux/slice/ancSlice';
import SummaryCards from './components/SummaryCards';
import KeyRatesChart from './components/KeyRatesChart';
import ANCStatistics from './components/ANCStatistics';
import DeliveryMetrics from './components/DeliveryMetrics';
import PNCStatistics from './components/PNCStatistics';
import MaternalHealth from './components/MaternalHealth';
import EmptyState from './components/EmptyState';

const MaternityAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.anc);

  React.useEffect(() => {
    dispatch(fetchMaternityAnalytics());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Loading Maternity Analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Maternity Analytics"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  const hasData = analytics && analytics.summary.totalDeliveries > 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3">🤰</span>
          Maternity Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Comprehensive overview of maternal and neonatal health indicators
        </p>
      </div>

      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          {/* Summary Cards - Top Row */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24}>
              <SummaryCards data={analytics.summary} />
            </Col>
          </Row>

          {/* Key Rates & ANC Statistics - Middle Row */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={12}>
              <KeyRatesChart data={analytics.keyRates} />
            </Col>
            <Col xs={24} lg={12}>
              <ANCStatistics data={analytics.ancStatistics} />
            </Col>
          </Row>

          {/* Delivery Metrics & PNC Statistics - Bottom Row */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} lg={12}>
              <DeliveryMetrics 
                deliveryModes={analytics.deliveryModes}
                birthWeightStats={analytics.birthWeightStats}
                complicationRates={analytics.complicationRates}
              />
            </Col>
            <Col xs={24} lg={12}>
              <PNCStatistics data={analytics.pncStatistics} />
            </Col>
          </Row>

          {/* Maternal Health - Full Width */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <MaternalHealth 
                hivStats={analytics.hivStatistics}
                maternalDemographics={analytics.maternalDemographics}
                ultrasoundStats={analytics.ultrasoundStatistics}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default MaternityAnalytics;