import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStockItems,
  issueItems,
  fetchIssuedItems,
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
  message,
  Tag,
} from "antd";
import {
  ReloadOutlined,
  ExportOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const InventoryOut = () => {
  const dispatch = useDispatch();
  const { stockItems, items, issueItemLoading, loading, error } = useSelector(
    (state) => state.warehouse
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(getStockItems({}));
    dispatch(fetchIssuedItems());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(getStockItems({}));
    dispatch(fetchIssuedItems());
  };

  const handleIssue = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    dispatch(issueItems(values))
      .unwrap()
      .then(() => {
        message.success("Items issued successfully");
        setModalVisible(false);
        dispatch(getStockItems({}));
        dispatch(fetchIssuedItems());
      })
      .catch((err) => {
        message.error(err.message || "Failed to issue items");
      });
  };

  const issuedColumns = [
    {
      title: "Item",
      dataIndex: ["item", "name"],
      key: "item",
      render: (text) => <strong>{text || "N/A"}</strong>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
      render: (text) => text || "N/A",
    },
    {
      title: "Issued By",
      dataIndex: "issued_by",
      key: "issued_by",
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
      render: (text, record) => (
        <div>
          <strong>{text || "N/A"}</strong>
          {record.item?.isLowStock && (
            <Tag color="orange" style={{ marginLeft: 8 }}>Low Stock</Tag>
          )}
          {record.item?.isCritical && (
            <Tag color="red" style={{ marginLeft: 8 }}>Critical</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Batch #",
      dataIndex: "batch_number",
      key: "batch_number",
    },
    {
      title: "Available Qty",
      dataIndex: "current_quantity",
      key: "current_quantity",
      render: (qty, record) => (
        <span style={{ color: record.item?.isCritical ? "red" : record.item?.isLowStock ? "orange" : "inherit" }}>
          {qty}
        </span>
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "unit_cost",
      key: "unit_cost",
      render: (cost) => `$${parseFloat(cost || 0).toFixed(2)}`,
    },
    {
      title: "Expiry",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (date) => date ? moment(date).format("YYYY-MM-DD") : "N/A",
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Issue Stock (Inventory Out)</Title>
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
                icon={<SendOutlined />}
                onClick={handleIssue}
              >
                Issue Items
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Title level={5}>Available Stock</Title>
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
        <Title level={5}>Recently Issued Items</Title>
        <Table
          columns={issuedColumns}
          dataSource={items}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>

      <Modal
        title="Issue Items"
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
            name="item_id"
            label="Item"
            rules={[{ required: true, message: "Please select an item" }]}
          >
            <Select placeholder="Select item">
              {stockItems.map((batch) => (
                <Option key={batch.item_id} value={batch.item_id}>
                  {batch.item?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Enter quantity" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="department_id" label="Department">
            <Select placeholder="Select department (optional)">
              <Option value="lab">Laboratory</Option>
              <Option value="pharmacy">Pharmacy</Option>
              <Option value="ward">Ward</Option>
              <Option value="theatre">Theatre</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Select placeholder="Select or enter notes">
              <Option value="Emergency">Emergency</Option>
              <Option value="Routine">Routine</Option>
              <Option value="Restock">Restock</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={issueItemLoading}>
                Issue Items
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryOut;

