import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLowStockItems,
  resolveStockAlert,
  clearStoreError,
} from "../../../redux/slice/inventorySlice";
import {
  Table,
  Button,
  Tag,
  message,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
  Alert,
} from "antd";
import {
  ReloadOutlined,
  CheckOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title, Text } = Typography;

const LowStock = () => {
  const dispatch = useDispatch();
  const { lowStockItems, loading, error } = useSelector(
    (state) => state.warehouse
  );
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchLowStockItems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchLowStockItems());
  };

  const handleResolve = (alertId) => {
    dispatch(resolveStockAlert(alertId))
      .unwrap()
      .then(() => {
        message.success("Alert resolved successfully");
        dispatch(fetchLowStockItems());
      })
      .catch((err) => {
        message.error(err.message || "Failed to resolve alert");
      });
  };

  const criticalItems = lowStockItems.filter((item) => item.is_critical);
  const warningItems = lowStockItems.filter((item) => !item.is_critical);

  const columns = [
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          {record.is_critical && (
            <Tag color="red" style={{ marginLeft: 8 }}>CRITICAL</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Current Qty",
      dataIndex: "current_quantity",
      key: "current_quantity",
      render: (qty, record) => (
        <Text type={record.is_critical ? "danger" : "warning"} strong>
          {qty}
        </Text>
      ),
    },
    {
      title: "Reorder Level",
      dataIndex: "reorder_level",
      key: "reorder_level",
    },
    {
      title: "Critical Level",
      dataIndex: "critical_level",
      key: "critical_level",
    },
    {
      title: "Batch #",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.is_critical ? "red" : "orange"}>
          {record.is_critical ? "Critical" : "Low Stock"}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Low Stock Alerts</Title>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        {criticalItems.length > 0 && (
          <Alert
            message="Critical Stock Levels"
            description={`${criticalItems.length} item(s) are at critical level and need immediate attention!`}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        {warningItems.length > 0 && (
          <Alert
            message="Low Stock Warning"
            description={`${warningItems.length} item(s) are below reorder level.`}
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        {lowStockItems.length === 0 && !loading && (
          <Alert
            message="All Stock Levels Normal"
            description="No items are currently below reorder levels."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          dataSource={lowStockItems}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>
    </div>
  );
};

export default LowStock;

