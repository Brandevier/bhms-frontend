import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStockItems,
  adjustStock,
  fetchStockAdjustments,
  clearStoreError,
} from "../../../redux/slice/inventorySlice";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Modal,
  Form,
  Select,
  InputNumber,
  Radio,
  message,
  Tag,
} from "antd";
import {
  ReloadOutlined,
  SwapOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const StockAdjustment = () => {
  const dispatch = useDispatch();
  const { stockItems, stockAdjustments, adjustLoading, loading, error } = useSelector(
    (state) => state.warehouse
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(getStockItems({}));
    dispatch(fetchStockAdjustments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(getStockItems({}));
    dispatch(fetchStockAdjustments());
  };

  const handleAdjust = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    dispatch(adjustStock(values))
      .unwrap()
      .then(() => {
        message.success("Stock adjusted successfully");
        setModalVisible(false);
        dispatch(getStockItems({}));
        dispatch(fetchStockAdjustments());
      })
      .catch((err) => {
        message.error(err.message || "Failed to adjust stock");
      });
  };

  const adjustmentTypeColors = {
    addition: "green",
    reduction: "red",
    correction: "blue",
    damage: "orange",
    expired: "default",
  };

  const adjustmentColumns = [
    {
      title: "Item",
      dataIndex: ["item", "name"],
      key: "item",
      render: (text) => <strong>{text || "N/A"}</strong>,
    },
    {
      title: "Batch #",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Type",
      dataIndex: "adjustment_type",
      key: "adjustment_type",
      render: (type) => (
        <Tag color={adjustmentTypeColors[type]}>{type?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty, record) => (
        <span style={{ color: record.adjustment_type === "addition" ? "green" : "red" }}>
          {record.adjustment_type === "addition" ? "+" : "-"}{qty}
        </span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Adjusted By",
      dataIndex: "adjusted_by",
      key: "adjusted_by",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const stockColumns = [
    {
      title: "Item",
      dataIndex: ["item", "name"],
      key: "item",
      render: (text) => <strong>{text || "N/A"}</strong>,
    },
    {
      title: "Batch #",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Current Qty",
      dataIndex: "current_quantity",
      key: "current_quantity",
    },
    {
      title: "Unit Cost",
      dataIndex: "unit_cost",
      key: "unit_cost",
      render: (cost) => `$${parseFloat(cost || 0).toFixed(2)}`,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => loc || "N/A",
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Stock Adjustments</Title>
          </Col>
          <Col>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleAdjust}
              >
                Adjust Stock
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Title level={5}>Current Stock</Title>
        <Table
          columns={stockColumns}
          dataSource={stockItems}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          size="small"
          scroll={isMobile ? { x: true } : undefined}
        />
      </Card>

      <Card>
        <Title level={5}>Adjustment History</Title>
        <Table
          columns={adjustmentColumns}
          dataSource={stockAdjustments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>

      <Modal
        title="Adjust Stock"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="batch_id"
            label="Select Stock (Batch)"
            rules={[{ required: true, message: "Please select a batch" }]}
          >
            <Select placeholder="Select batch">
              {stockItems.map((batch) => (
                <Option key={batch.id} value={batch.id}>
                  {batch.item?.name} - Batch: {batch.batch_number} (Qty: {batch.current_quantity})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="adjustment_type"
            label="Adjustment Type"
            rules={[{ required: true, message: "Select adjustment type" }]}
          >
            <Radio.Group>
              <Radio value="addition">Addition (+)</Radio>
              <Radio value="reduction">Reduction (-)</Radio>
              <Radio value="correction">Correction</Radio>
              <Radio value="damage">Damage</Radio>
              <Radio value="expired">Expired</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Enter quantity" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Enter reason for adjustment" }]}
          >
            <Select placeholder="Select reason">
              <Option value="Inventory Count">Inventory Count</Option>
              <Option value="Damaged Goods">Damaged Goods</Option>
              <Option value="Expired Items">Expired Items</Option>
              <Option value="Data Correction">Data Correction</Option>
              <Option value="Theft/Loss">Theft/Loss</Option>
              <Option value="Sample Usage">Sample Usage</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <Select placeholder="Add notes (optional)">
              <Option value="Verified count">Verified count</Option>
              <Option value="Pending verification">Pending verification</Option>
              <Option value="Manager approved">Manager approved</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={adjustLoading}>
                Submit Adjustment
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockAdjustment;
