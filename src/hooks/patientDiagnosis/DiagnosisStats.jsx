import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  BarChartOutlined 
} from '@ant-design/icons';
import { DIAGNOSIS_TYPES } from './utils';

const { Text } = Typography;

const DiagnosisStats = ({ diagnoses }) => {
  if (!diagnoses || diagnoses.length === 0) return null;
  
  const stats = {
    total: diagnoses.length,
    confirmed: diagnoses.filter(d => d.diagnosis_type === 'confirmed_diagnosis').length,
    provisional: diagnoses.filter(d => d.diagnosis_type === 'provisional_diagnosis').length,
    active: diagnoses.filter(d => d.status === 'Active').length,
    resolved: diagnoses.filter(d => d.status === 'Resolved').length
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8} md={4}>
        <Card size="small" hoverable>
          <Statistic
            title="Total Diagnoses"
            value={stats.total}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={8} md={4}>
        <Card size="small" hoverable>
          <Statistic
            title="Confirmed"
            value={stats.confirmed}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: DIAGNOSIS_TYPES.confirmed_diagnosis.color }}
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {Math.round((stats.confirmed / stats.total) * 100)}% of total
          </Text>
        </Card>
      </Col>
      
      <Col xs={24} sm={8} md={4}>
        <Card size="small" hoverable>
          <Statistic
            title="Provisional"
            value={stats.provisional}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: DIAGNOSIS_TYPES.provisional_diagnosis.color }}
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {Math.round((stats.provisional / stats.total) * 100)}% of total
          </Text>
        </Card>
      </Col>
      
      <Col xs={24} sm={8} md={4}>
        <Card size="small" hoverable>
          <Statistic
            title="Active"
            value={stats.active}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={8} md={4}>
        <Card size="small" hoverable>
          <Statistic
            title="Resolved"
            value={stats.resolved}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DiagnosisStats;