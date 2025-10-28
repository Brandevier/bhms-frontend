import React from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { 
  MedicineBoxOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const StatsOverview = ({ prescriptions }) => {
  const totalPrescriptions = prescriptions.length;
  const dispensedCount = prescriptions.filter(p => p.is_dispensed).length;
  const pendingCount = prescriptions.filter(p => !p.is_dispensed).length;
  const emergencyCount = prescriptions.filter(p => p.is_emergency).length;
  
  const uniquePatients = new Set(prescriptions.map(p => p.visit?.patient?.id)).size;

  // Calculate total revenue (simplified)
  const totalRevenue = prescriptions
    .filter(p => p.is_dispensed)
    .reduce((sum, p) => sum + (p.medicine?.market_price || 0) * p.quantity, 0);

  const stats = [
    {
      title: 'Total Patients',
      value: uniquePatients,
      icon: <UserOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Total Prescriptions',
      value: totalPrescriptions,
      icon: <MedicineBoxOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Dispensed',
      value: dispensedCount,
      icon: <CheckCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: <ClockCircleOutlined />,
      color: '#faad14'
    },
    {
      title: 'Emergency Cases',
      value: emergencyCount,
      icon: <SafetyCertificateOutlined />,
      color: '#f5222d'
    },
    {
      title: 'Total Revenue',
      value: `GHC ${totalRevenue.toFixed(2)}`,
      icon: <DollarOutlined />,
      color: '#722ed1'
    }
  ];

  return (
    <div>
      <Title level={4} className="!mb-4">Pharmacy Overview</Title>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={index}>
            <Card className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { 
                  style: { color: stat.color } 
                })}
                valueStyle={{ color: stat.color, fontSize: '24px' }}
              />
              <div className="mt-2 text-gray-600 font-medium">{stat.title}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatsOverview;