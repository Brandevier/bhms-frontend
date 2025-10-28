import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  UserOutlined, 
  MedicineBoxOutlined, 
  WarningOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const KPICards = ({ stats }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Prescriptions"
            value={stats.core?.total || 0}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Dispensed"
            value={stats.core?.dispensed || 0}
            prefix={<MedicineBoxOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Emergency Cases"
            value={stats.core?.emergency || 0}
            prefix={<WarningOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Active Prescriptions"
            value={stats.active_prescriptions || 0}
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default KPICards;