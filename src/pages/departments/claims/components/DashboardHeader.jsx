import React from 'react';
import { Row, Col, Button, Space, Typography } from 'antd';
import { ReloadOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DashboardHeader = ({ onRefresh, refreshing }) => {
  return (
    <Row justify="space-between" align="middle" className="mb-6">
      <Col>
        <Space align="center">
          <FileTextOutlined className="text-blue-600 text-2xl" />
          <Title level={3} className="m-0">Claims Dashboard</Title>
        </Space>
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          loading={refreshing}
          onClick={onRefresh}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Refresh Data
        </Button>
      </Col>
    </Row>
  );
};

export default DashboardHeader;
