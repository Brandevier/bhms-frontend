import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const FluidSummaryCards = ({ fluidData, settings }) => {
  const calculateBalancePercentage = () => {
    const maxBalance = settings?.critical_threshold_positive || 1000;
    return Math.min(Math.abs(fluidData.currentBalance) / maxBalance * 100, 100);
  };

  const getBalanceStatus = () => {
    if (Math.abs(fluidData.currentBalance) > (settings?.critical_threshold_positive || 1000)) {
      return 'exception';
    }
    if (Math.abs(fluidData.currentBalance) > (settings?.alert_threshold_positive || 500)) {
      return 'active';
    }
    return 'success';
  };

  const getBalanceColor = () => {
    if (fluidData.currentBalance > (settings?.critical_threshold_positive || 1000)) return '#ff4d4f';
    if (fluidData.currentBalance > (settings?.alert_threshold_positive || 500)) return '#faad14';
    if (fluidData.currentBalance < -(settings?.critical_threshold_negative || 1000)) return '#ff4d4f';
    if (fluidData.currentBalance < -(settings?.alert_threshold_negative || 500)) return '#faad14';
    return '#52c41a';
  };

  return (
    <Row gutter={[16, 16]} className="mb-6">
      <Col xs={24} sm={12} md={6}>
        <Card className="shadow-md">
          <Statistic
            title="Current Balance"
            value={fluidData.currentBalance}
            suffix="ml"
            valueStyle={{ color: getBalanceColor() }}
          />
          <Progress
            percent={calculateBalancePercentage()}
            status={getBalanceStatus()}
            showInfo={false}
            className="mt-2"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className="shadow-md">
          <Statistic
            title="Total Intake"
            value={fluidData.totalIntake}
            suffix="ml"
            valueStyle={{ color: '#1890ff' }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Target: {fluidData.targetIntake}ml</span>
            <span className="flex items-center">
              {fluidData.totalIntake >= fluidData.targetIntake ? (
                <CaretUpOutlined className="text-green-500 mr-1" />
              ) : (
                <CaretDownOutlined className="text-red-500 mr-1" />
              )}
              {((fluidData.totalIntake / fluidData.targetIntake) * 100).toFixed(1)}%
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className="shadow-md">
          <Statistic
            title="Total Output"
            value={fluidData.totalOutput}
            suffix="ml"
            valueStyle={{ color: '#ff4d4f' }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Target: {fluidData.targetOutput}ml</span>
            <span className="flex items-center">
              {fluidData.totalOutput >= fluidData.targetOutput ? (
                <CaretUpOutlined className="text-green-500 mr-1" />
              ) : (
                <CaretDownOutlined className="text-red-500 mr-1" />
              )}
              {((fluidData.totalOutput / fluidData.targetOutput) * 100).toFixed(1)}%
            </span>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card className="shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">Net Balance</div>
            <div
              className="text-3xl font-bold"
              style={{ color: getBalanceColor() }}
            >
              {fluidData.currentBalance > 0 ? '+' : ''}
              {fluidData.currentBalance} ml
            </div>
            <div className="text-sm text-gray-500 mt-2">24h Period</div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default FluidSummaryCards;