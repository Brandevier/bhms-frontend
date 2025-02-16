import React from "react";
import { Card, List, Skeleton, Tooltip } from "antd";
import { FileTextOutlined, DownloadOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";

const statusIcons = {
  requested: <Tooltip title="Requested"><ClockCircleOutlined style={{ color: "#faad14" }} /></Tooltip>, // Yellow
  "in-progress": <Tooltip title="In Progress"><SyncOutlined spin style={{ color: "#1890ff" }} /></Tooltip>, // Blue
  completed: <Tooltip title="Completed"><CheckCircleOutlined style={{ color: "#52c41a" }} /></Tooltip>, // Green
  cancelled: <Tooltip title="Cancelled"><CloseCircleOutlined style={{ color: "#ff4d4f" }} /></Tooltip>, // Red
};

const HealthReports = ({ patient_data, status }) => {
  if (status === "loading") {
    return (
      <Card title="Lab Results">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  const labResults = patient_data?.slice(0, 4) || [];

  return (
    <Card title="Lab Results">
      {labResults.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>No lab results available</p>
      ) : (
        <List
          dataSource={labResults}
          renderItem={(result) => (
            <List.Item
              key={result.id}
              actions={[
                result.status === "completed" ? (
                  <BhmsButton
                    type="primary"
                    onClick={() => console.log(`Downloading ${result.test_name?.test_name}`)}
                    outline
                    block={false}
                    width="28px"
                    height="28px"
                  >
                    <DownloadOutlined />
                  </BhmsButton>
                ) : (
                  statusIcons[result.status] // Show status icon if not completed
                )
              ]}
            >
              <FileTextOutlined /> {result.test_name?.test_name || "Unknown Test"}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default HealthReports;
