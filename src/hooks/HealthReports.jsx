import React from "react";
import { Card, List, Skeleton, Tooltip, Empty, Button, Badge } from "antd";
import { 
  FileTextOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";

const statusIcons = {
  pending: <Tooltip title="Pending"><ClockCircleOutlined style={{ color: "#faad14" }} /></Tooltip>,
  completed: <Tooltip title="Completed"><CheckCircleOutlined style={{ color: "#52c41a" }} /></Tooltip>,
};

const HealthReports = ({ patient_data, status, onViewAll }) => {
  if (status === "loading") {
    return (
      <Card title="Pending Lab Tests">
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  // Filter only pending results and take first 5
  const pendingResults = (patient_data || [])
    .filter(result => result.status === "pending")
    .slice(0, 5);

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Pending Lab Tests</span>
          {patient_data?.length > 5 && (
            <Button 
              type="link" 
              onClick={onViewAll}
              icon={<EllipsisOutlined />}
            >
              View All
            </Button>
          )}
        </div>
      }
    >
      {pendingResults.length === 0 ? (
        <Empty description="No pending lab tests" />
      ) : (
        <List
          dataSource={pendingResults}
          renderItem={(result) => (
            <List.Item
              key={result.id}
              actions={[
                <Badge 
                  dot 
                  color={result.status === 'completed' ? '#52c41a' : '#faad14'}
                >
                  {statusIcons[result.status]}
                </Badge>
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined />}
                title={result.template?.name || "Unknown Test"}
                description={result.status === 'completed' 
                  ? `Completed on ${new Date(result.updatedAt).toLocaleDateString()}`
                  : 'Waiting for results...'
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default HealthReports;