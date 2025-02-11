import React from "react";
import { Card, Row, Col, Calendar, List, Typography, Progress, Table } from "antd";
// import { Line } from "@ant-design/charts";



const { Title, Text } = Typography;

const BhmsAdminDashboardLayout = () => {
  // Mock Data
  const stats = [
    { title: "Total Invoice", value: "1,287", change: "+5.4%" },
    { title: "Total Patients", value: "965", change: "+3.2%" },
    { title: "Appointments", value: "128", change: "-1.5%" },
    { title: "Bedcount", value: "315", change: "+2.0%" },
  ];

  const revenueConfig = {
    data: [
      { date: "Mon", revenue: 1000 },
      { date: "Tue", revenue: 1200 },
      { date: "Wed", revenue: 800 },
      { date: "Thu", revenue: 1500 },
      { date: "Fri", revenue: 1100 },
    ],
    xField: "date",
    yField: "revenue",
    smooth: true,
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        {stats.map((stat, index) => (
          <Col span={6} key={index}>
            <Card>
              <Title level={5}>{stat.title}</Title>
              <Text strong style={{ fontSize: "1.5em" }}>{stat.value}</Text>
              <Text type={stat.change.startsWith("+") ? "success" : "danger"}>
                {stat.change}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Patient Overview">
            <Progress type="circle" percent={80} format={() => "1,890"} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue">
            {/* <Line {...revenueConfig} /> */}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}><Card title="Doctors' Schedule">Schedule Data</Card></Col>
        <Col span={8}><Card title="Reports">Reports Data</Card></Col>
        <Col span={8}><Card title="Patient Overview (Pie Chart)">Pie Chart</Card></Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={16}><Card title="Patient Appointments">Appointments List</Card></Col>
        <Col span={8}><Card><Calendar fullscreen={false} /></Card></Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8} offset={8}>
          <Card title="Recent Activity">
            <List>
              <List.Item>Patient discharged</List.Item>
              <List.Item>New appointment scheduled</List.Item>
              <List.Item>Doctor's meeting</List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BhmsAdminDashboardLayout;
