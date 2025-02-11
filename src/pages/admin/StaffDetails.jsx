import React from "react";
import { Card, Col, Row, Avatar, Tag, Statistic, Typography, Divider, List } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const StaffDetails = () => {
  return (
    <div style={{ padding: 20, background: "#F5F7FA" }}>
      <Row gutter={[16, 16]}>
        {/* Left Side: Staff Profile */}
        <Col span={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              {/* Profile Picture */}
              <Avatar size={100} src="/assets/user.png" />
              <Title level={4}>Dr. Petra Winsburry</Title>
              <Text type="secondary">General Practitioner</Text>
              <div style={{ marginTop: 10 }}>
                <Tag color="green">Available</Tag>
              </div>
            </div>
            <Divider />
            {/* Specialization */}
            <Text strong>Specialist:</Text>
            <p>Routine Check-Ups</p>
            {/* Bio */}
            <Text>
              Dr. Petra Winsburry is a seasoned general medicine practitioner with over 15 years of experience...
            </Text>
            <Divider />
            {/* Contact Info */}
            <div>
              <p>
                <PhoneOutlined /> +1 555-326-5678
              </p>
              <p>
                <MailOutlined /> petra.winsburry@wellhealthhospital.com
              </p>
              <p>
                <EnvironmentOutlined /> WellHealth Hospital, 456 8th Street, Springfield, IL, USA
              </p>
            </div>
            <Divider />
            {/* Work Experience */}
            <Text strong>Work Experience:</Text>
            <List
              dataSource={["General Practitioner", "Resident Doctor"]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>

        {/* Right Side: Dashboard Stats & Charts */}
        <Col span={18}>
          <Row gutter={[16, 16]}>
            {/* Statistics */}
            <Col span={6}>
              <Card>
                <Statistic title="Total Patients" value={150} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Total Appointments" value={320} />
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Appointment Stats Chart Placeholder */}
          <Card title="Appointment Stats">
            {/* Insert Chart Component Here */}
            <div style={{ height: 200, background: "#e8e8e8", borderRadius: 8, textAlign: "center", lineHeight: "200px" }}>
              [Chart Placeholder]
            </div>
          </Card>

          <Divider />

          {/* Schedule Section */}
          <Card title="Schedule">
            <List
              dataSource={[
                { time: "8:00 - 9:00 AM", name: "Rupert Twiney" },
                { time: "9:00 - 10:00 AM", name: "Ruth Hardinger" },
                { time: "10:00 - 11:00 AM", name: "Caven G. Simpson" },
                { time: "11:00 - 12:00 PM", name: "Staff Meeting" },
                { time: "12:00 - 1:00 PM", name: "Administrative Work" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>{item.name}</Text>
                  <Text type="secondary">{item.time}</Text>
                </List.Item>
              )}
            />
          </Card>

          <Divider />

          {/* Feedback Section */}
          <Card title="Feedback">
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={[
                { name: "Alice Johnson", date: "2024-01-11", feedback: "Dr. Winsburry is very thorough..." },
                { name: "Robert Brown", date: "2025-02-05", feedback: "Great experience, highly recommend..." },
                { name: "Chance Siphon", date: "2025-02-01", feedback: "Dr. Winsburry is efficient, professional..." },
                { name: "Lincoln Donin", date: "2025-01-27", feedback: "A fantastic physician who truly listens..." },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Card>
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">{item.date}</Text>
                    <p>{item.feedback}</p>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffDetails;
