import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  FileTextOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  DashboardOutlined,
  SettingOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

const KPICards = ({ statistics }) => {
  const kpis = [
    {
      title: 'Total Claims',
      value: statistics.totalClaims || 0,
      icon: <FileTextOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Claim Items',
      value: statistics.totalClaimItems || 0,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Prescriptions',
      value: statistics.totalPrescriptions || 0,
      icon: <MedicineBoxOutlined />,
      color: '#faad14'
    },
    {
      title: 'Lab Tests',
      value: statistics.totalLabTests || 0,
      icon: <ExperimentOutlined />,
      color: '#f5222d'
    },
    {
      title: 'Diagnoses',
      value: statistics.totalDiagnoses || 0,
      icon: <DashboardOutlined />,
      color: '#722ed1'
    },
    {
      title: 'Procedures',
      value: statistics.totalProcedures || 0,
      icon: <SettingOutlined />,
      color: '#13c2c2'
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {kpis.map((kpi, index) => (
        <Col xs={24} sm={12} md={8} lg={4} key={index}>
          <Card size="small">
            <Statistic
              title={kpi.title}
              value={kpi.value}
              prefix={kpi.icon}
              valueStyle={{ color: kpi.color }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default KPICards;