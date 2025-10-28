import React from 'react';
import { Row, Col, Card, Statistic, Tag } from 'antd';
import {
    FileTextOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    MedicineBoxOutlined
} from '@ant-design/icons';

const StatsCards = ({ stats }) => {
    const statItems = [
        {
            title: 'Total Patients',
            value: stats.totalPatients,
            prefix: <UserOutlined />,
            color: '#1890ff',
            suffix: 'patients'
        },
        {
            title: 'Total Prescriptions',
            value: stats.totalPrescriptions,
            prefix: <FileTextOutlined />,
            color: '#52c41a',
            suffix: 'items'
        },
        {
            title: 'Emergency Cases',
            value: stats.emergencyCount,
            prefix: <ExclamationCircleOutlined />,
            color: '#ff4d4f',
            suffix: 'urgent'
        },
        {
            title: "Today's Requests",
            value: stats.todayCount,
            prefix: <ClockCircleOutlined />,
            color: '#faad14',
            suffix: 'today'
        }
    ];

    return (
        <Row gutter={16}>
            {statItems.map((item, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <Card 
                        style={{ 
                            border: `1px solid ${item.color}20`,
                            background: `${item.color}05`
                        }}
                    >
                        <Statistic
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{item.title}</span>
                                    <Tag color={item.color}>{item.suffix}</Tag>
                                </div>
                            }
                            value={item.value}
                            prefix={React.cloneElement(item.prefix, { 
                                style: { color: item.color } 
                            })}
                            valueStyle={{ color: item.color }}
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatsCards;