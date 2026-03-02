import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockTransfers,
  createStockTransfer,
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
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const StockTransfer = () => {
  const dispatch = useDispatch();
  const { stockTransfers, transferLoading, error, itemsList, stockItems } = useSelector(
    (state) => state.warehouse
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    dispatch(fetchStockTransfers({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "An error occurred");
      dispatch(clearStoreError());
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchStockTransfers({}));
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    const data = {
      ...values,
      items: [],
    };

    dispatch(createStockTransfer(data))
      .unwrap()
      .then(() => {
        message.success("Stock transfer created successfully");
        setModalVisible(false);
        dispatch(fetchStockTransfers({}));
      })
      .catch((err) => {
        message.error(err.message || "Failed to create stock transfer");
      });
  };

  const statusColors = {
    pending: "orange",
    approved: "blue",
    completed: "green",
    cancelled: "red",
  };

  const columns = [
    {
      title: "Transfer #",
      dataIndex: "id",
      key: "id",
      render: (text) => <strong>{text?.substring(0, 8)}</strong>,
    },
    {
      title: "From Department",
      dataIndex: ["from_department", "name"],
      key: "from_department",
      render: (text) => text || "Main Store",
    },
    {
      title: "To Department",
      dataIndex: ["to_department", "name"],
      key: "to_department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items?.length || 0,
    },
    {
      title: "Transferred By",
      dataIndex: "transferred_by",
      key: "transferred_by",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">
            View Details
          </Button>
          {record.status === "pending" && (
            <>
              <Button type="link" size="small" style={{ color: "green" }}>
                Approve
              </Button>
              <Button type="link" size="small" danger>
                Cancel
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "8px" : "16px" }}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4}>Stock Transfers</Title>
          </Col>
          <Col>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={transferLoading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={handleAdd}
              >
                New Transfer
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={stockTransfers}
          rowKey="id"
          loading={transferLoading}
          pagination={{ pageSize: 10 }}
          scroll={isMobile ? { x: true } : undefined}
          size={isMobile ? "small" : "middle"}
        />
      </Card>

      <Modal
        title="Create Stock Transfer"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="to_department_id"
            label="Transfer To (Department)"
            rules={[{ required: true, message: "Please select a department" }]}
          >
            <Select placeholder="Select department">
              <Option value="lab">Laboratory</Option>
              <Option value="pharmacy">Pharmacy</Option>
              <Option value="ward">Ward</Option>
              <Option value="theatre">Theatre</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Enter transfer notes" rows={3} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={transferLoading}>
                Create Transfer
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockTransfer;

