import React from "react";
import { Card, Avatar, Typography, Tooltip, Badge, Button, Space, message } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title, Text } = Typography;

const statusColors = {
  pending: "orange",
  scheduled: "blue",
  ongoing: "cyan",
  completed: "green",
  canceled: "red",
};

const PatientProcedure = ({ procedures, onDelete }) => {
  if (!procedures || procedures.length === 0) {
    return <Text type="secondary">No procedures available</Text>;
  }

  // Get the latest procedure by sorting based on createdAt
  const latestProcedure = procedures.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <Card style={{ borderRadius: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={5} style={{ margin: 0 }}>Patient Procedure</Title>
        <Tooltip title="Delete Procedure">
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            onClick={() => {
              onDelete(latestProcedure.id);
              message.success("Procedure deleted successfully.");
            }}
          />
        </Tooltip>
      </div>

      {/* Procedure Details */}
      <Text strong>{latestProcedure.name}</Text>
      <p style={{ margin: "5px 0", color: "#555" }}>{latestProcedure.description}</p>

      {/* Status */}
      <Badge color={statusColors[latestProcedure.status]} text={latestProcedure.status.toUpperCase()} />

      {/* Doctor Information */}
      <div style={{ marginTop: 10 }}>
        <Text strong>Doctor: </Text>
        <Avatar size="small" icon={<UserOutlined />} />
        <Text style={{ marginLeft: 8 }}>
          Dr. {latestProcedure.doctor?.lastName} ({latestProcedure.doctor?.email})
        </Text>
      </div>

      {/* Assisting Staff */}
      <div style={{ marginTop: 10 }}>
        <Text strong>Assisting Staff:</Text>
        <Space size="small" wrap>
          {latestProcedure.assisting_staff.length > 0 ? (
            latestProcedure.assisting_staff.map((staff) => (
              <Tooltip key={staff.id} title={`${staff.lastName} (${staff.email})`}>
                <Avatar style={{ backgroundColor: "#87d068" }}>{staff.lastName.charAt(0)}</Avatar>
              </Tooltip>
            ))
          ) : (
            <Text style={{ color: "#888" }}>No assistants</Text>
          )}
        </Space>
      </div>

      {/* Procedure Date */}
      <div style={{ marginTop: 10 }}>
        <Text strong>Scheduled Date:</Text>{" "}
        <Text>
          {latestProcedure.procedure_datetime
            ? moment(latestProcedure.procedure_datetime).format("MMM DD, YYYY HH:mm A")
            : "Not Set"}
        </Text>
      </div>
    </Card>
  );
};

export default PatientProcedure;
