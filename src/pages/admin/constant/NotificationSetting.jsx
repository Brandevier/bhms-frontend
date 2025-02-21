import React, { useState } from "react";
import { List, Switch, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const NotificationSetting = () => {
  const [notifications, setNotifications] = useState({
    staff: false,
    patient: false,
    payment: false,
    logs: false,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationData = [
    {
      key: "staff",
      title: "Staff Notifications",
      description: "Receive alerts for staff activities and schedules.",
    },
    {
      key: "patient",
      title: "Patient Notifications",
      description: "Notify patients via SMS about discharge and fellow up. (Extra charges apply)",
    },
    {
      key: "payment",
      title: "Payment Notifications",
      description: "Get notified about transactions and billing updates.",
    },
    {
      key: "logs",
      title: "Logs Notifications",
      description: "Receive alerts for system logs and activity tracking.",
    },
  ];

  return (
    <List
      dataSource={notificationData}
      renderItem={(item) => (
        <List.Item style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
          <div>
            <Tooltip title={item.description}>
              <span style={{ marginRight: 8 }}>
                {item.title} <InfoCircleOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
              </span>
            </Tooltip>
          </div>
          <Switch checked={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
        </List.Item>
      )}
    />
  );
};

export default NotificationSetting;

