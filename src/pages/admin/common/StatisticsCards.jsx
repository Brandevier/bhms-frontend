// components/staff/StatisticsCards.js
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const StatisticsCards = ({ staff, attendance = [] }) => {
  const stats = [
    {
      title: 'Total Attendance',
      value: attendance.length,
      icon: <UserOutlined />,
      color: '#3f8600'
    },
    {
      title: 'Last Login',
      value: moment(staff.last_login).format('MMM D, YYYY'),
      icon: <ClockCircleOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Account Created',
      value: moment(staff.created_at).format('MMM D, YYYY'),
      icon: <CalendarOutlined />,
      color: '#faad14'
    },
    {
      title: 'This Month Attendance',
      value: attendance.filter(a => moment(a.scannedAt).isSame(moment(), 'month')).length,
      icon: <UserOutlined />,
      color: '#f50'
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {stats.map((stat, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <Card>
            <Statistic
              title={stat.title}
              value={stat.value}
              valueStyle={{ color: stat.color }}
              prefix={stat.icon}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;