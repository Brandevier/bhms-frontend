import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { TeamOutlined, UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const StatisticsCards = ({ staffData = [] }) => {
  const totalStaff = staffData?.length || 0;
  const activeTodayStaff = staffData?.filter(staff => 
    staff.last_login && dayjs(staff.last_login).isSame(dayjs(), 'day')
  ).length || 0;
  const neverLoggedIn = staffData?.filter(staff => !staff.last_login).length || 0;

  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic
            title="Total Staff"
            value={totalStaff}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic
            title="Active Today"
            value={activeTodayStaff}
            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic
            title="Never Logged In"
            value={neverLoggedIn}
            prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards;